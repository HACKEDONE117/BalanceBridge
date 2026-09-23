package com.reconciliation.parser;

import com.opencsv.CSVReader;
import com.reconciliation.model.Transaction;
import com.reconciliation.normalizer.AmountNormalizer;
import com.reconciliation.normalizer.DateNormalizer;
import com.reconciliation.normalizer.DescriptionNormalizer;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.util.*;

@Component
public class CsvParser {

    private final ColumnDetector columnDetector;
    private final DateNormalizer dateNormalizer;
    private final AmountNormalizer amountNormalizer;
    private final DescriptionNormalizer descriptionNormalizer;

    public CsvParser(ColumnDetector columnDetector, DateNormalizer dateNormalizer,
                     AmountNormalizer amountNormalizer, DescriptionNormalizer descriptionNormalizer) {
        this.columnDetector = columnDetector;
        this.dateNormalizer = dateNormalizer;
        this.amountNormalizer = amountNormalizer;
        this.descriptionNormalizer = descriptionNormalizer;
    }

    public List<Transaction> parseCsv(InputStream inputStream, String reconciliationId, String fileId, String sourceType, Map<String, String> userMappings) throws Exception {
        List<Transaction> transactions = new ArrayList<>();

        try (CSVReader csvReader = new CSVReader(new InputStreamReader(inputStream))) {
            List<String[]> allRows = csvReader.readAll();
            if (allRows.isEmpty()) return transactions;

            int headerRowIndex = findHeaderRow(allRows);
            String[] headers = allRows.get(headerRowIndex);
            List<String> headerList = Arrays.asList(headers);

            Map<String, Integer> colMap = new HashMap<>();
            if (userMappings != null && !userMappings.isEmpty()) {
                for (Map.Entry<String, String> entry : userMappings.entrySet()) {
                    try {
                        colMap.put(entry.getKey(), Integer.parseInt(entry.getValue()));
                    } catch (NumberFormatException ignored) {}
                }
            } else {
                colMap = columnDetector.autoDetectColumns(headerList);
            }

            for (int r = headerRowIndex + 1; r < allRows.size(); r++) {
                String[] row = allRows.get(r);
                if (row.length == 0) continue;

                String dateStr = getValue(row, colMap.get("date"));
                String descStr = getValue(row, colMap.get("description"));
                String debitStr = getValue(row, colMap.get("debit"));
                String creditStr = getValue(row, colMap.get("credit"));
                String amountStr = getValue(row, colMap.get("amount"));
                String refStr = getValue(row, colMap.get("reference"));
                String balStr = getValue(row, colMap.get("balance"));

                LocalDate txnDate = dateNormalizer.normalizeDate(dateStr);
                if (txnDate == null) continue;

                Double debit = amountNormalizer.normalizeAmount(debitStr);
                Double credit = amountNormalizer.normalizeAmount(creditStr);
                Double amount = amountNormalizer.normalizeAmount(amountStr);

                String txnType = amountNormalizer.detectTransactionType(debitStr, creditStr, amountStr);
                if (amount == null) {
                    if (debit != null) amount = debit;
                    else if (credit != null) amount = credit;
                }

                if (amount == null || amount <= 0) continue;

                Transaction tx = new Transaction();
                tx.setReconciliationId(reconciliationId);
                tx.setFileId(fileId);
                tx.setSource(sourceType);
                tx.setTransactionDate(txnDate);
                tx.setValueDate(txnDate);
                tx.setRawDescription(descStr);
                tx.setDescription(descStr);
                tx.setNormalizedDescription(descriptionNormalizer.normalizeDescription(descStr));
                tx.setDebit(debit);
                tx.setCredit(credit);
                tx.setAmount(amount);
                tx.setTransactionType(txnType);

                String extractedRef = descriptionNormalizer.extractReferenceNumber(descStr);
                tx.setReferenceNumber(refStr != null && !refStr.trim().isEmpty() ? refStr.trim() : extractedRef);
                tx.setChequeNumber(descriptionNormalizer.extractChequeNumber(descStr));
                tx.setBalance(amountNormalizer.normalizeAmount(balStr));
                tx.setOriginalRowNumber(r + 1);

                transactions.add(tx);
            }
        }

        return transactions;
    }

    private int findHeaderRow(List<String[]> rows) {
        for (int i = 0; i < Math.min(15, rows.size()); i++) {
            Map<String, Integer> detected = columnDetector.autoDetectColumns(Arrays.asList(rows.get(i)));
            if (detected.containsKey("date") || detected.containsKey("amount") || detected.containsKey("debit")) {
                return i;
            }
        }
        return 0;
    }

    private String getValue(String[] row, Integer index) {
        if (index != null && index >= 0 && index < row.length) {
            return row[index].trim();
        }
        return "";
    }
}
