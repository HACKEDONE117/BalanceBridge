package com.reconciliation.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.reconciliation.model.Reconciliation;
import com.reconciliation.model.Transaction;
import com.reconciliation.repository.ReconciliationRepository;
import com.reconciliation.repository.TransactionRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReportService {

    private final ReconciliationRepository reconciliationRepository;
    private final TransactionRepository transactionRepository;
    public ReportService(ReconciliationRepository reconciliationRepository,
                         TransactionRepository transactionRepository) {
        this.reconciliationRepository = reconciliationRepository;
        this.transactionRepository = transactionRepository;
    }

    public ByteArrayInputStream generatePdfReport(String reconciliationId) throws Exception {
        Optional<Reconciliation> reconOpt = reconciliationRepository.findById(reconciliationId);
        if (reconOpt.isEmpty()) throw new IllegalArgumentException("Reconciliation not found");

        Reconciliation recon = reconOpt.get();
        List<Transaction> accTxns = transactionRepository.findByReconciliationIdAndSource(reconciliationId, "ACCOUNTING");

        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        // Fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.DARK_GRAY);
        Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.GRAY);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);

        // Header Title
        Paragraph title = new Paragraph("BALANCEBRIDGE - FINANCIAL RECONCILIATION REPORT", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph company = new Paragraph(recon.getCompanyName() + " | Period: " + recon.getPeriodStart() + " to " + recon.getPeriodEnd(), subFont);
        company.setAlignment(Element.ALIGN_CENTER);
        document.add(company);
        document.add(new Paragraph(" "));

        // Executive Summary Box
        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(100);

        Map<String, Object> sum = recon.getSummary();
        addSummaryRow(summaryTable, "Reconciliation Name", recon.getName(), bodyFont);
        addSummaryRow(summaryTable, "Total Accounting Transactions", String.valueOf(sum.getOrDefault("totalAccountingCount", 0)), bodyFont);
        addSummaryRow(summaryTable, "Total Bank Transactions", String.valueOf(sum.getOrDefault("totalBankCount", 0)), bodyFont);
        addSummaryRow(summaryTable, "Matched Transactions", String.valueOf(sum.getOrDefault("matchedCount", 0)), bodyFont);
        addSummaryRow(summaryTable, "Possible Matches", String.valueOf(sum.getOrDefault("possibleMatchCount", 0)), bodyFont);
        addSummaryRow(summaryTable, "Missing in Bank", String.valueOf(sum.getOrDefault("missingInBankCount", 0)), bodyFont);
        addSummaryRow(summaryTable, "Missing in Accounting", String.valueOf(sum.getOrDefault("missingInAccountingCount", 0)), bodyFont);

        document.add(summaryTable);
        document.add(new Paragraph(" "));

        // Section: Matched Transactions
        document.add(new Paragraph("Matched Transactions Summary", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY)));
        document.add(new Paragraph(" "));

        PdfPTable matchTable = new PdfPTable(5);
        matchTable.setWidthPercentage(100);
        matchTable.setWidths(new float[]{2, 4, 2, 2, 2});

        addTableHeader(matchTable, new String[]{"Date", "Description", "Amount (₹)", "Status", "Score"}, headerFont);

        for (Transaction tx : accTxns) {
            if ("MATCHED".equals(tx.getStatus()) || "POSSIBLE_MATCH".equals(tx.getStatus())) {
                matchTable.addCell(new PdfPCell(new Phrase(tx.getTransactionDate().toString(), bodyFont)));
                matchTable.addCell(new PdfPCell(new Phrase(tx.getDescription(), bodyFont)));
                matchTable.addCell(new PdfPCell(new Phrase(String.format("%.2f", tx.getAmount()), bodyFont)));
                matchTable.addCell(new PdfPCell(new Phrase(tx.getStatus(), bodyFont)));
                matchTable.addCell(new PdfPCell(new Phrase(tx.getStatus().equals("MATCHED") ? "100%" : "85%", bodyFont)));
            }
        }
        document.add(matchTable);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generateExcelReport(String reconciliationId) throws Exception {
        Optional<Reconciliation> reconOpt = reconciliationRepository.findById(reconciliationId);
        if (reconOpt.isEmpty()) throw new IllegalArgumentException("Reconciliation not found");

        Reconciliation recon = reconOpt.get();
        List<Transaction> accTxns = transactionRepository.findByReconciliationIdAndSource(reconciliationId, "ACCOUNTING");
        List<Transaction> bankTxns = transactionRepository.findByReconciliationIdAndSource(reconciliationId, "BANK");

        Workbook workbook = new XSSFWorkbook();

        // Sheet 1: Summary
        Sheet sumSheet = workbook.createSheet("Summary");
        Row r0 = sumSheet.createRow(0);
        r0.createCell(0).setCellValue("BalanceBridge Reconciliation Report - " + recon.getName());

        Map<String, Object> summaryMap = recon.getSummary();
        int rowIdx = 2;
        if (summaryMap != null) {
            for (Map.Entry<String, Object> entry : summaryMap.entrySet()) {
                Row r = sumSheet.createRow(rowIdx++);
                r.createCell(0).setCellValue(entry.getKey());
                r.createCell(1).setCellValue(String.valueOf(entry.getValue()));
            }
        }

        // Sheet 2: Matched
        populateTransactionSheet(workbook.createSheet("Matched"), accTxns, "MATCHED");

        // Sheet 3: Possible Matches
        populateTransactionSheet(workbook.createSheet("Possible Matches"), accTxns, "POSSIBLE_MATCH");

        // Sheet 4: Missing in Bank
        populateTransactionSheet(workbook.createSheet("Missing in Bank"), accTxns, "UNMATCHED");

        // Sheet 5: Missing in Accounting
        populateTransactionSheet(workbook.createSheet("Missing in Accounting"), bankTxns, "UNMATCHED");

        // Sheet 6: Amount Mismatch
        populateTransactionSheet(workbook.createSheet("Amount Mismatch"), accTxns, "AMOUNT_MISMATCH");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addSummaryRow(PdfPTable table, String key, String val, Font font) {
        table.addCell(new PdfPCell(new Phrase(key, font)));
        table.addCell(new PdfPCell(new Phrase(val, font)));
    }

    private void addTableHeader(PdfPTable table, String[] headers, Font font) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, font));
            cell.setBackgroundColor(Color.BLUE);
            table.addCell(cell);
        }
    }

    private void populateTransactionSheet(Sheet sheet, List<Transaction> list, String filterStatus) {
        Row hRow = sheet.createRow(0);
        hRow.createCell(0).setCellValue("Date");
        hRow.createCell(1).setCellValue("Description");
        hRow.createCell(2).setCellValue("Amount");
        hRow.createCell(3).setCellValue("Type");
        hRow.createCell(4).setCellValue("Reference");
        hRow.createCell(5).setCellValue("Status");

        int rIdx = 1;
        for (Transaction tx : list) {
            if (filterStatus == null || filterStatus.equals(tx.getStatus())) {
                Row r = sheet.createRow(rIdx++);
                r.createCell(0).setCellValue(tx.getTransactionDate().toString());
                r.createCell(1).setCellValue(tx.getDescription());
                r.createCell(2).setCellValue(tx.getAmount() != null ? tx.getAmount() : 0.0);
                r.createCell(3).setCellValue(tx.getTransactionType());
                r.createCell(4).setCellValue(tx.getReferenceNumber() != null ? tx.getReferenceNumber() : "");
                r.createCell(5).setCellValue(tx.getStatus());
            }
        }
    }
}
