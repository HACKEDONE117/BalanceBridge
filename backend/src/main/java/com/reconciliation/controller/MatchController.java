package com.reconciliation.controller;

import com.reconciliation.model.Match;
import com.reconciliation.model.Transaction;
import com.reconciliation.repository.MatchRepository;
import com.reconciliation.repository.TransactionRepository;
import com.reconciliation.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchRepository matchRepository;
    private final TransactionRepository transactionRepository;
    private final AuditService auditService;

    public MatchController(MatchRepository matchRepository,
                           TransactionRepository transactionRepository,
                           AuditService auditService) {
        this.matchRepository = matchRepository;
        this.transactionRepository = transactionRepository;
        this.auditService = auditService;
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmMatch(@PathVariable String id) {
        Optional<Match> matchOpt = matchRepository.findById(id);
        if (matchOpt.isEmpty()) return ResponseEntity.notFound().build();

        Match match = matchOpt.get();
        match.setStatus("CONFIRMED");
        matchRepository.save(match);

        updateTransactionStatus(match.getAccountingTransactionId(), "MATCHED");
        updateTransactionStatus(match.getBankTransactionId(), "MATCHED");

        auditService.logAction("SYSTEM", "USER", "MATCH_CONFIRMED", "Confirmed match ID: " + id);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectMatch(@PathVariable String id) {
        Optional<Match> matchOpt = matchRepository.findById(id);
        if (matchOpt.isEmpty()) return ResponseEntity.notFound().build();

        Match match = matchOpt.get();
        match.setStatus("REJECTED");
        matchRepository.save(match);

        updateTransactionStatus(match.getAccountingTransactionId(), "UNMATCHED");
        updateTransactionStatus(match.getBankTransactionId(), "UNMATCHED");

        auditService.logAction("SYSTEM", "USER", "MATCH_REJECTED", "Rejected match ID: " + id);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/manual-match")
    public ResponseEntity<?> manualMatch(@RequestBody Map<String, String> request) {
        String reconId = request.get("reconciliationId");
        String accTxnId = request.get("accountingTransactionId");
        String bankTxnId = request.get("bankTransactionId");

        Match match = new Match();
        match.setReconciliationId(reconId);
        match.setAccountingTransactionId(accTxnId);
        match.setBankTransactionId(bankTxnId);
        match.setScore(100.0);
        match.setMatchType("MANUAL");
        match.setMatchReasons(List.of("✓ Manually matched by user"));
        match.setMatchedBy("USER");
        match.setStatus("CONFIRMED");
        matchRepository.save(match);

        updateTransactionStatus(accTxnId, "MATCHED");
        updateTransactionStatus(bankTxnId, "MATCHED");

        auditService.logAction("USER", "USER", "MANUAL_MATCH", "Created manual match for transactions: " + accTxnId + " and " + bankTxnId);
        return ResponseEntity.ok(match);
    }

    private void updateTransactionStatus(String txnId, String status) {
        if (txnId == null) return;
        Optional<Transaction> txOpt = transactionRepository.findById(txnId);
        if (txOpt.isPresent()) {
            Transaction tx = txOpt.get();
            tx.setStatus(status);
            tx.setLocked(status.equals("MATCHED"));
            transactionRepository.save(tx);
        }
    }
}
