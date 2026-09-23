package com.reconciliation.service;

import com.reconciliation.model.Match;
import com.reconciliation.model.MatchingConfig;
import com.reconciliation.model.Reconciliation;
import com.reconciliation.model.Transaction;
import com.reconciliation.repository.MatchRepository;
import com.reconciliation.repository.ReconciliationRepository;
import com.reconciliation.repository.TransactionRepository;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class MatchingEngineService {

    private final TransactionRepository transactionRepository;
    private final MatchRepository matchRepository;
    private final ReconciliationRepository reconciliationRepository;

    private final LevenshteinDistance levenshteinDistance = new LevenshteinDistance();
    private final JaroWinklerSimilarity jaroWinkler = new JaroWinklerSimilarity();

    public MatchingEngineService(TransactionRepository transactionRepository,
                                 MatchRepository matchRepository,
                                 ReconciliationRepository reconciliationRepository) {
        this.transactionRepository = transactionRepository;
        this.matchRepository = matchRepository;
        this.reconciliationRepository = reconciliationRepository;
    }

    public void runReconciliation(String reconciliationId) {
        Optional<Reconciliation> reconOpt = reconciliationRepository.findById(reconciliationId);
        if (reconOpt.isEmpty()) return;

        Reconciliation recon = reconOpt.get();
        recon.setStatus("PROCESSING");
        reconciliationRepository.save(recon);

        MatchingConfig config = recon.getConfig() != null ? recon.getConfig() : new MatchingConfig();

        List<Transaction> accTxns = transactionRepository.findByReconciliationIdAndSource(reconciliationId, "ACCOUNTING");
        List<Transaction> bankTxns = transactionRepository.findByReconciliationIdAndSource(reconciliationId, "BANK");

        // Clear existing matches & lock states
        matchRepository.deleteByReconciliationId(reconciliationId);
        accTxns.forEach(tx -> { tx.setStatus("UNMATCHED"); tx.setLocked(false); tx.setMatchedPairId(null); });
        bankTxns.forEach(tx -> { tx.setStatus("UNMATCHED"); tx.setLocked(false); tx.setMatchedPairId(null); });

        // Detect duplicates within same file
        detectDuplicates(accTxns);
        detectDuplicates(bankTxns);

        List<Match> generatedMatches = new ArrayList<>();

        // Level 1: Exact Reference + Amount Match
        for (Transaction acc : accTxns) {
            if (acc.isLocked() || acc.getReferenceNumber() == null || acc.getReferenceNumber().isEmpty()) continue;
            for (Transaction bank : bankTxns) {
                if (bank.isLocked() || bank.getReferenceNumber() == null || bank.getReferenceNumber().isEmpty()) continue;

                if (acc.getReferenceNumber().equalsIgnoreCase(bank.getReferenceNumber())
                        && Objects.equals(acc.getAmount(), bank.getAmount())) {
                    
                    Match match = createMatch(recon.getId(), acc, bank, 100.0, "EXACT",
                            Arrays.asList("✓ UTR/Reference number matched (" + acc.getReferenceNumber() + ")",
                                          "✓ Exact amount matched (₹" + String.format("%.2f", acc.getAmount()) + ")",
                                          "✓ Date matched"));
                    generatedMatches.add(match);
                    lockPair(acc, bank, "MATCHED", match.getId());
                    break;
                }
            }
        }

        // Level 2: Exact Amount + Exact Date Match
        for (Transaction acc : accTxns) {
            if (acc.isLocked()) continue;
            for (Transaction bank : bankTxns) {
                if (bank.isLocked()) continue;

                if (Objects.equals(acc.getAmount(), bank.getAmount())
                        && acc.getTransactionDate().equals(bank.getTransactionDate())) {

                    double descSim = calculateSimilarity(acc.getNormalizedDescription(), bank.getNormalizedDescription());
                    List<String> reasons = new ArrayList<>();
                    reasons.add("✓ Exact amount matched (₹" + String.format("%.2f", acc.getAmount()) + ")");
                    reasons.add("✓ Exact transaction date matched (" + acc.getTransactionDate() + ")");
                    reasons.add("✓ Description similarity: " + (int) descSim + "%");

                    Match match = createMatch(recon.getId(), acc, bank, 90.0, "HIGH_CONFIDENCE", reasons);
                    generatedMatches.add(match);
                    lockPair(acc, bank, "MATCHED", match.getId());
                    break;
                }
            }
        }

        // Level 3: Exact Amount + Date Tolerance Match (0 - Configurable Days)
        for (Transaction acc : accTxns) {
            if (acc.isLocked()) continue;
            for (Transaction bank : bankTxns) {
                if (bank.isLocked()) continue;

                if (Objects.equals(acc.getAmount(), bank.getAmount())) {
                    long daysDiff = Math.abs(ChronoUnit.DAYS.between(acc.getTransactionDate(), bank.getTransactionDate()));

                    if (daysDiff <= config.getDateToleranceDays()) {
                        double descSim = calculateSimilarity(acc.getNormalizedDescription(), bank.getNormalizedDescription());
                        double score = 85.0 - (daysDiff * 5);

                        List<String> reasons = new ArrayList<>();
                        reasons.add("✓ Amount matched (₹" + String.format("%.2f", acc.getAmount()) + ")");
                        reasons.add("✓ Date within tolerance (" + daysDiff + " day(s) difference)");
                        reasons.add("✓ Description similarity: " + (int) descSim + "%");

                        String type = score >= config.getExactMatchThreshold() ? "HIGH_CONFIDENCE" : "POSSIBLE";
                        Match match = createMatch(recon.getId(), acc, bank, score, type, reasons);
                        generatedMatches.add(match);

                        String status = type.equals("HIGH_CONFIDENCE") ? "MATCHED" : "POSSIBLE_MATCH";
                        lockPair(acc, bank, status, match.getId());
                        break;
                    }
                }
            }
        }

        // Level 4: Amount + Description Fuzzy Similarity Match
        for (Transaction acc : accTxns) {
            if (acc.isLocked()) continue;
            for (Transaction bank : bankTxns) {
                if (bank.isLocked()) continue;

                if (Objects.equals(acc.getAmount(), bank.getAmount())) {
                    double similarity = calculateSimilarity(acc.getNormalizedDescription(), bank.getNormalizedDescription());

                    if (similarity >= config.getMinDescriptionSimilarity()) {
                        List<String> reasons = new ArrayList<>();
                        reasons.add("✓ Exact amount matched (₹" + String.format("%.2f", acc.getAmount()) + ")");
                        reasons.add("✓ High text similarity: " + String.format("%.1f", similarity) + "%");

                        Match match = createMatch(recon.getId(), acc, bank, similarity, "POSSIBLE", reasons);
                        generatedMatches.add(match);
                        lockPair(acc, bank, "POSSIBLE_MATCH", match.getId());
                        break;
                    }
                }
            }
        }

        // Level 5: Detect Amount Discrepancy (Reference or Date + High Desc Match, but amount differs)
        for (Transaction acc : accTxns) {
            if (acc.isLocked()) continue;
            for (Transaction bank : bankTxns) {
                if (bank.isLocked()) continue;

                boolean refMatch = acc.getReferenceNumber() != null && acc.getReferenceNumber().equalsIgnoreCase(bank.getReferenceNumber());
                double descSim = calculateSimilarity(acc.getNormalizedDescription(), bank.getNormalizedDescription());

                if (refMatch || (acc.getTransactionDate().equals(bank.getTransactionDate()) && descSim >= 80.0)) {
                    List<String> reasons = new ArrayList<>();
                    reasons.add("⚠ Amount mismatch: Accounting ₹" + acc.getAmount() + " vs Bank ₹" + bank.getAmount());
                    if (refMatch) reasons.add("✓ Reference number matched (" + acc.getReferenceNumber() + ")");

                    Match match = createMatch(recon.getId(), acc, bank, 60.0, "AMOUNT_MISMATCH", reasons);
                    generatedMatches.add(match);
                    lockPair(acc, bank, "AMOUNT_MISMATCH", match.getId());
                    break;
                }
            }
        }

        // Save updated transactions and matches
        transactionRepository.saveAll(accTxns);
        transactionRepository.saveAll(bankTxns);
        matchRepository.saveAll(generatedMatches);

        // Calculate Summary Totals
        updateReconciliationSummary(recon, accTxns, bankTxns, generatedMatches);
    }

    private double calculateSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null || s1.isEmpty() || s2.isEmpty()) return 0.0;
        if (s1.equals(s2)) return 100.0;

        double jaro = jaroWinkler.apply(s1, s2) * 100.0;

        int maxLen = Math.max(s1.length(), s2.length());
        int dist = levenshteinDistance.apply(s1, s2);
        double levSim = ((double) (maxLen - dist) / maxLen) * 100.0;

        return (jaro * 0.6) + (levSim * 0.4);
    }

    private void detectDuplicates(List<Transaction> list) {
        Map<String, List<Transaction>> map = new HashMap<>();
        for (Transaction t : list) {
            String key = t.getTransactionDate() + "_" + t.getAmount() + "_" + t.getNormalizedDescription();
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(t);
        }

        for (List<Transaction> group : map.values()) {
            if (group.size() > 1) {
                for (Transaction t : group) {
                    if (!t.isLocked()) {
                        t.setStatus("DUPLICATE");
                    }
                }
            }
        }
    }

    private Match createMatch(String reconId, Transaction acc, Transaction bank, double score, String type, List<String> reasons) {
        Match match = new Match();
        match.setReconciliationId(reconId);
        match.setAccountingTransactionId(acc.getId());
        match.setBankTransactionId(bank.getId());
        match.setScore(score);
        match.setMatchType(type);
        match.setMatchReasons(reasons);
        match.setMatchedBy("AUTO");
        match.setStatus(type.equals("POSSIBLE") || type.equals("AMOUNT_MISMATCH") ? "PENDING" : "CONFIRMED");
        return match;
    }

    private void lockPair(Transaction acc, Transaction bank, String status, String matchId) {
        acc.setLocked(true);
        acc.setStatus(status);
        acc.setMatchedPairId(bank.getId());

        bank.setLocked(true);
        bank.setStatus(status);
        bank.setMatchedPairId(acc.getId());
    }

    private void updateReconciliationSummary(Reconciliation recon, List<Transaction> accTxns, List<Transaction> bankTxns, List<Match> matches) {
        long matchedCount = accTxns.stream().filter(t -> "MATCHED".equals(t.getStatus())).count();
        long possibleCount = accTxns.stream().filter(t -> "POSSIBLE_MATCH".equals(t.getStatus())).count();
        long amountMismatchCount = accTxns.stream().filter(t -> "AMOUNT_MISMATCH".equals(t.getStatus())).count();
        long duplicateCount = accTxns.stream().filter(t -> "DUPLICATE".equals(t.getStatus())).count() +
                              bankTxns.stream().filter(t -> "DUPLICATE".equals(t.getStatus())).count();

        long missingInBank = accTxns.stream().filter(t -> "UNMATCHED".equals(t.getStatus())).count();
        long missingInAcc = bankTxns.stream().filter(t -> "UNMATCHED".equals(t.getStatus())).count();

        double totalAccAmt = accTxns.stream().mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0).sum();
        double totalBankAmt = bankTxns.stream().mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0).sum();
        double matchedAmt = accTxns.stream().filter(t -> "MATCHED".equals(t.getStatus())).mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0).sum();

        double totalAccDebit = accTxns.stream().mapToDouble(t -> t.getDebit() != null ? t.getDebit() : ("DEBIT".equals(t.getTransactionType()) && t.getAmount() != null ? t.getAmount() : 0.0)).sum();
        double totalAccCredit = accTxns.stream().mapToDouble(t -> t.getCredit() != null ? t.getCredit() : ("CREDIT".equals(t.getTransactionType()) && t.getAmount() != null ? t.getAmount() : 0.0)).sum();
        double totalBankDebit = bankTxns.stream().mapToDouble(t -> t.getDebit() != null ? t.getDebit() : ("DEBIT".equals(t.getTransactionType()) && t.getAmount() != null ? t.getAmount() : 0.0)).sum();
        double totalBankCredit = bankTxns.stream().mapToDouble(t -> t.getCredit() != null ? t.getCredit() : ("CREDIT".equals(t.getTransactionType()) && t.getAmount() != null ? t.getAmount() : 0.0)).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalAccountingCount", accTxns.size());
        summary.put("totalBankCount", bankTxns.size());
        summary.put("matchedCount", matchedCount);
        summary.put("possibleMatchCount", possibleCount);
        summary.put("amountMismatchCount", amountMismatchCount);
        summary.put("duplicateCount", duplicateCount);
        summary.put("missingInBankCount", missingInBank);
        summary.put("missingInAccountingCount", missingInAcc);
        summary.put("totalAccountingAmount", totalAccAmt);
        summary.put("totalBankAmount", totalBankAmt);
        summary.put("matchedAmount", matchedAmt);
        summary.put("differenceAmount", Math.abs(totalAccAmt - totalBankAmt));

        summary.put("totalAccountingDebit", totalAccDebit);
        summary.put("totalAccountingCredit", totalAccCredit);
        summary.put("totalBankDebit", totalBankDebit);
        summary.put("totalBankCredit", totalBankCredit);

        recon.setSummary(summary);
        recon.setStatus("COMPLETED");
        reconciliationRepository.save(recon);
    }
}
