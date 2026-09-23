package com.reconciliation.parser;

import com.reconciliation.model.Transaction;
import com.reconciliation.normalizer.AmountNormalizer;
import com.reconciliation.normalizer.DateNormalizer;
import com.reconciliation.normalizer.DescriptionNormalizer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class PdfParser {

    private final DateNormalizer dateNormalizer;
    private final AmountNormalizer amountNormalizer;
    private final DescriptionNormalizer descriptionNormalizer;

    public PdfParser(DateNormalizer dateNormalizer, AmountNormalizer amountNormalizer,
                     DescriptionNormalizer descriptionNormalizer) {
        this.dateNormalizer = dateNormalizer;
        this.amountNormalizer = amountNormalizer;
        this.descriptionNormalizer = descriptionNormalizer;
    }

    public List<Transaction> parsePdf(InputStream inputStream, String reconciliationId, String fileId, String sourceType, String pdfPassword) throws Exception {
        List<Transaction> transactions = new ArrayList<>();

        PDDocument document = null;
        try {
            if (pdfPassword != null && !pdfPassword.trim().isEmpty()) {
                document = PDDocument.load(inputStream, pdfPassword.trim());
            } else {
                try {
                    document = PDDocument.load(inputStream);
                } catch (InvalidPasswordException ipe) {
                    throw new IllegalArgumentException("PDF is password protected. Please provide the PDF password.");
                }
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String pdfText = stripper.getText(document);

            String[] lines = pdfText.split("\\r?\\n");
            int rowNum = 0;

            Transaction currentTx = null;
            StringBuilder narrationBuffer = new StringBuilder();
            StringBuilder refBuffer = new StringBuilder();

            for (String line : lines) {
                rowNum++;
                String trimmed = line.trim();
                if (trimmed.isEmpty()) continue;

                // Skip Header Lines & Summary Lines
                String upperLine = trimmed.toUpperCase();
                if (upperLine.contains("CLOSING BALANCE") || upperLine.contains("OPENING BALANCE") ||
                    upperLine.contains("WITHDRAWAL AMT") || upperLine.contains("DEPOSIT AMT") ||
                    upperLine.contains("PARTICULAR") || upperLine.contains("DEBIT(NAVE)") || upperLine.contains("CREDIT(JAMA)")) {
                    continue;
                }

                // Check if line starts with a date pattern (e.g., 01/04/25, 01/04/2025, 1-Apr-2025)
                Matcher dateMatcher = Pattern.compile("^(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}|\\d{1,2}\\s+[A-Za-z]{3}\\s+\\d{2,4})").matcher(trimmed);

                if (dateMatcher.find()) {
                    // Flush previous transaction
                    if (currentTx != null) {
                        finalizeTransaction(currentTx, narrationBuffer, refBuffer);
                        if (currentTx.getAmount() != null && currentTx.getAmount() > 0) {
                            transactions.add(currentTx);
                        }
                    }

                    // Start new transaction
                    String dateStr = dateMatcher.group(1);
                    LocalDate txnDate = dateNormalizer.normalizeDate(dateStr);

                    currentTx = new Transaction();
                    currentTx.setReconciliationId(reconciliationId);
                    currentTx.setFileId(fileId);
                    currentTx.setSource(sourceType);
                    currentTx.setTransactionDate(txnDate);
                    currentTx.setValueDate(txnDate);
                    currentTx.setOriginalRowNumber(rowNum);

                    narrationBuffer = new StringBuilder();
                    refBuffer = new StringBuilder();

                    String remainder = trimmed.substring(dateMatcher.end()).trim();

                    // Find numbers at the end of line (amounts, balances)
                    Matcher amountMatcher = Pattern.compile("([\\d,]+\\.\\d{2}(?:[A-Za-z]{2})?)").matcher(remainder);
                    List<Double> amountsFound = new ArrayList<>();
                    List<String> rawAmountStrings = new ArrayList<>();
                    while (amountMatcher.find()) {
                        String amtStr = amountMatcher.group(1);
                        Double amt = amountNormalizer.normalizeAmount(amtStr);
                        if (amt != null) {
                            amountsFound.add(amt);
                            rawAmountStrings.add(amtStr);
                        }
                    }

                    if (!amountsFound.isEmpty()) {
                        Double amount = amountsFound.get(0);
                        Double balance = amountsFound.size() > 1 ? amountsFound.get(amountsFound.size() - 1) : null;
                        currentTx.setAmount(amount);
                        currentTx.setBalance(balance);

                        String textOnly = remainder;
                        for (String aStr : rawAmountStrings) {
                            textOnly = textOnly.replace(aStr, "");
                        }
                        textOnly = textOnly.replaceAll("\\s+", " ").trim();
                        narrationBuffer.append(textOnly);
                    } else {
                        narrationBuffer.append(remainder);
                    }

                    String txnType = amountNormalizer.detectTransactionType(null, null, remainder);
                    currentTx.setTransactionType(txnType);
                    if ("DEBIT".equals(txnType)) {
                        currentTx.setDebit(currentTx.getAmount());
                    } else {
                        currentTx.setCredit(currentTx.getAmount());
                    }

                } else if (currentTx != null) {
                    Matcher utrMatcher = Pattern.compile("([A-Z0-9]{12,25})").matcher(trimmed);
                    if (utrMatcher.find()) {
                        refBuffer.append(" ").append(utrMatcher.group(1));
                    }
                    narrationBuffer.append(" ").append(trimmed);
                }
            }

            // Flush final transaction
            if (currentTx != null) {
                finalizeTransaction(currentTx, narrationBuffer, refBuffer);
                if (currentTx.getAmount() != null && currentTx.getAmount() > 0) {
                    transactions.add(currentTx);
                }
            }
        } finally {
            if (document != null) {
                document.close();
            }
        }

        return transactions;
    }

    private void finalizeTransaction(Transaction tx, StringBuilder narrationBuf, StringBuilder refBuf) {
        String fullDesc = narrationBuf.toString().replaceAll("\\s+", " ").trim();
        tx.setRawDescription(fullDesc);
        tx.setDescription(fullDesc);
        tx.setNormalizedDescription(descriptionNormalizer.normalizeDescription(fullDesc));

        String refStr = refBuf.toString().trim();
        String extractedRef = descriptionNormalizer.extractReferenceNumber(fullDesc + " " + refStr);
        tx.setReferenceNumber(extractedRef != null ? extractedRef : (refStr.isEmpty() ? null : refStr));
        tx.setChequeNumber(descriptionNormalizer.extractChequeNumber(fullDesc));
    }
}
