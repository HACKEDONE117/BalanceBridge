package com.reconciliation.parser;

import com.reconciliation.model.Transaction;
import com.reconciliation.normalizer.AmountNormalizer;
import com.reconciliation.normalizer.DateNormalizer;
import com.reconciliation.normalizer.DescriptionNormalizer;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

@Component
public class ExcelParser {

    private final ColumnDetector columnDetector;
    private final DateNormalizer dateNormalizer;
    private final AmountNormalizer amountNormalizer;
    private final DescriptionNormalizer descriptionNormalizer;

    public ExcelParser(ColumnDetector columnDetector, DateNormalizer dateNormalizer,
                       AmountNormalizer amountNormalizer, DescriptionNormalizer descriptionNormalizer) {
        this.columnDetector = columnDetector;
        this.dateNormalizer = dateNormalizer;
        this.amountNormalizer = amountNormalizer;
        this.descriptionNormalizer = descriptionNormalizer;
    }

    public List<Transaction> parseExcel(InputStream inputStream, String reconciliationId, String fileId, String sourceType, Map<String, String> userMappings) throws Exception {
        List<Transaction> transactions = new ArrayList<>();

        Workbook workbook = WorkbookFactory.create(inputStream);
        Sheet sheet = workbook.getSheetAt(0);

        int headerRowIndex = findHeaderRow(sheet);
        Row headerRow = sheet.getRow(headerRowIndex);

        List<String> headers = new ArrayList<>();
        for (Cell cell : headerRow) {
            headers.add(getCellValueAsString(cell));
        }

        Map<String, Integer> colMap = new HashMap<>();
        if (userMappings != null && !userMappings.isEmpty()) {
            for (Map.Entry<String, String> entry : userMappings.entrySet()) {
                try {
                    colMap.put(entry.getKey(), Integer.parseInt(entry.getValue()));
                } catch (NumberFormatException ignored) {}
            }
        } else {
            colMap = columnDetector.autoDetectColumns(headers);
        }

        for (int r = headerRowIndex + 1; r <= sheet.getLastRowNum(); r++) {
            Row row = sheet.getRow(r);
            if (row == null || isRowEmpty(row)) continue;

            String dateStr = colMap.containsKey("date") ? getCellValueAsString(row.getCell(colMap.get("date"))) : "";
            String descStr = colMap.containsKey("description") ? getCellValueAsString(row.getCell(colMap.get("description"))) : "";
            String debitStr = colMap.containsKey("debit") ? getCellValueAsString(row.getCell(colMap.get("debit"))) : "";
            String creditStr = colMap.containsKey("credit") ? getCellValueAsString(row.getCell(colMap.get("credit"))) : "";
            String amountStr = colMap.containsKey("amount") ? getCellValueAsString(row.getCell(colMap.get("amount"))) : "";
            String refStr = colMap.containsKey("reference") ? getCellValueAsString(row.getCell(colMap.get("reference"))) : "";
            String balStr = colMap.containsKey("balance") ? getCellValueAsString(row.getCell(colMap.get("balance"))) : "";

            LocalDate txnDate = dateNormalizer.normalizeDate(dateStr);
            if (txnDate == null) continue; // Skip invalid date rows

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

        workbook.close();
        return transactions;
    }

    private int findHeaderRow(Sheet sheet) {
        for (int i = 0; i <= Math.min(15, sheet.getLastRowNum()); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            List<String> cells = new ArrayList<>();
            for (Cell c : row) {
                cells.add(getCellValueAsString(c));
            }
            Map<String, Integer> detected = columnDetector.autoDetectColumns(cells);
            if (detected.containsKey("date") || detected.containsKey("amount") || detected.containsKey("debit")) {
                return i;
            }
        }
        return 0;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        DataFormatter formatter = new DataFormatter();
        return formatter.formatCellValue(cell).trim();
    }

    private boolean isRowEmpty(Row row) {
        for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
            Cell cell = row.getCell(c);
            if (cell != null && cell.getCellType() != CellType.BLANK) return false;
        }
        return true;
    }
}
