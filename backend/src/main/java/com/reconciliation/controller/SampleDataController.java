package com.reconciliation.controller;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/sample-data")
@CrossOrigin(origins = "*")
public class SampleDataController {

    @GetMapping("/accounting-excel")
    public ResponseEntity<byte[]> downloadSampleAccountingExcel() throws Exception {
        byte[] bytes = generateAccountingExcelBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sample-accounting.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bytes);
    }

    @GetMapping("/bank-excel")
    public ResponseEntity<byte[]> downloadSampleBankExcel() throws Exception {
        byte[] bytes = generateBankExcelBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sample-bank.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bytes);
    }

    @GetMapping("/accounting-csv")
    public ResponseEntity<byte[]> downloadSampleAccountingCsv() {
        String csv = "Date,Particulars,Debit Amount,Credit Amount,Voucher No\n" +
                "10/09/2026,ABC Traders Pvt Ltd,25000.00,,VOUCH-101\n" +
                "11/09/2026,Office Space Rent,,15000.00,VOUCH-102\n" +
                "12/09/2026,TechCorp Solutions,48500.00,,VOUCH-103\n" +
                "13/09/2026,Stationery Supplies,,3500.00,VOUCH-104\n" +
                "14/09/2026,Global Software License,12000.00,,VOUCH-105\n" +
                "15/09/2026,Consulting Fees Inc,,30000.00,VOUCH-106\n";

        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sample-accounting.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    @GetMapping("/bank-csv")
    public ResponseEntity<byte[]> downloadSampleBankCsv() {
        String csv = "Txn Date,Narration,Withdrawal,Deposit,UTR Number\n" +
                "10/09/2026,NEFT/ABC TRADERS PVT LTD/N12345678,25000.00,,N12345678\n" +
                "12/09/2026,UPI/OFFICE SPACE RENT/987654321,,15000.00,987654321\n" +
                "12/09/2026,RTGS/TECHCORP SOLUTIONS/R45678901,48500.00,,R45678901\n" +
                "13/09/2026,CHQ DEP/STATIONERY SUPPLIES,,3500.00,CHQ11022\n" +
                "14/09/2026,INB/GLOBAL SOFTWARE LICENSE/I78901234,12000.00,,I78901234\n" +
                "16/09/2026,NEFT/CONSULTING FEES INC/N99887766,,30000.00,N99887766\n";

        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sample-bank.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bytes);
    }

    private byte[] generateAccountingExcelBytes() throws Exception {
        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Tally Export");

        Row h = sheet.createRow(0);
        h.createCell(0).setCellValue("Date");
        h.createCell(1).setCellValue("Particulars");
        h.createCell(2).setCellValue("Debit");
        h.createCell(3).setCellValue("Credit");
        h.createCell(4).setCellValue("Ref No");

        Object[][] data = {
                {"10/09/2026", "ABC Traders Pvt Ltd", 25000.0, 0.0, "REF-101"},
                {"11/09/2026", "Office Space Rent", 0.0, 15000.0, "REF-102"},
                {"12/09/2026", "TechCorp Solutions", 48500.0, 0.0, "REF-103"},
                {"13/09/2026", "Stationery Supplies", 0.0, 3500.0, "REF-104"},
                {"14/09/2026", "Global Software License", 12000.0, 0.0, "REF-105"},
                {"15/09/2026", "Consulting Fees Inc", 0.0, 30000.0, "REF-106"}
        };

        for (int i = 0; i < data.length; i++) {
            Row r = sheet.createRow(i + 1);
            r.createCell(0).setCellValue((String) data[i][0]);
            r.createCell(1).setCellValue((String) data[i][1]);
            r.createCell(2).setCellValue((Double) data[i][2]);
            r.createCell(3).setCellValue((Double) data[i][3]);
            r.createCell(4).setCellValue((String) data[i][4]);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        wb.close();
        return out.toByteArray();
    }

    private byte[] generateBankExcelBytes() throws Exception {
        Workbook wb = new XSSFWorkbook();
        Sheet sheet = wb.createSheet("Bank Statement");

        Row h = sheet.createRow(0);
        h.createCell(0).setCellValue("Txn Date");
        h.createCell(1).setCellValue("Narration");
        h.createCell(2).setCellValue("Withdrawals");
        h.createCell(3).setCellValue("Deposits");
        h.createCell(4).setCellValue("UTR No");

        Object[][] data = {
                {"10/09/2026", "NEFT/ABC TRADERS PVT LTD/N12345678", 25000.0, 0.0, "N12345678"},
                {"12/09/2026", "UPI/OFFICE SPACE RENT/987654321", 0.0, 15000.0, "987654321"},
                {"12/09/2026", "RTGS/TECHCORP SOLUTIONS/R45678901", 48500.0, 0.0, "R45678901"},
                {"13/09/2026", "CHQ DEP/STATIONERY SUPPLIES", 0.0, 3500.0, "CHQ11022"},
                {"14/09/2026", "INB/GLOBAL SOFTWARE LICENSE/I78901234", 12000.0, 0.0, "I78901234"},
                {"16/09/2026", "NEFT/CONSULTING FEES INC/N99887766", 0.0, 30000.0, "N99887766"}
        };

        for (int i = 0; i < data.length; i++) {
            Row r = sheet.createRow(i + 1);
            r.createCell(0).setCellValue((String) data[i][0]);
            r.createCell(1).setCellValue((String) data[i][1]);
            r.createCell(2).setCellValue((Double) data[i][2]);
            r.createCell(3).setCellValue((Double) data[i][3]);
            r.createCell(4).setCellValue((String) data[i][4]);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        wb.write(out);
        wb.close();
        return out.toByteArray();
    }
}
