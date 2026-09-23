package com.reconciliation.service;

import com.reconciliation.model.StoredFile;
import com.reconciliation.model.Transaction;
import com.reconciliation.parser.CsvParser;
import com.reconciliation.parser.ExcelParser;
import com.reconciliation.parser.PdfParser;
import com.reconciliation.repository.FileRepository;
import com.reconciliation.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.*;

@Service
public class FileProcessingService {

    private final FileRepository fileRepository;
    private final TransactionRepository transactionRepository;
    private final ExcelParser excelParser;
    private final CsvParser csvParser;
    private final PdfParser pdfParser;

    public FileProcessingService(FileRepository fileRepository, TransactionRepository transactionRepository,
                                 ExcelParser excelParser, CsvParser csvParser, PdfParser pdfParser) {
        this.fileRepository = fileRepository;
        this.transactionRepository = transactionRepository;
        this.excelParser = excelParser;
        this.csvParser = csvParser;
        this.pdfParser = pdfParser;
    }

    public StoredFile processAndSaveFile(String reconciliationId, String sourceType, MultipartFile file, Map<String, String> userMappings) throws Exception {
        return processAndSaveFile(reconciliationId, sourceType, file, userMappings, null);
    }

    public StoredFile processAndSaveFile(String reconciliationId, String sourceType, MultipartFile file, Map<String, String> userMappings, String pdfPassword) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) filename = "file";

        String ext = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();

        StoredFile storedFile = new StoredFile();
        storedFile.setReconciliationId(reconciliationId);
        storedFile.setOriginalFileName(filename);
        storedFile.setFileType(ext.toUpperCase());
        storedFile.setSourceType(sourceType);
        storedFile.setFileSize(file.getSize());
        storedFile.setProcessingStatus("PENDING");
        if (userMappings != null) storedFile.setColumnMappings(userMappings);

        fileRepository.save(storedFile);

        List<Transaction> parsedTransactions = new ArrayList<>();
        InputStream is = file.getInputStream();

        if (ext.equals("xlsx") || ext.equals("xls")) {
            storedFile.setProcessingMethod("EXCEL_PARSER");
            parsedTransactions = excelParser.parseExcel(is, reconciliationId, storedFile.getId(), sourceType, userMappings);
        } else if (ext.equals("csv")) {
            storedFile.setProcessingMethod("CSV_PARSER");
            parsedTransactions = csvParser.parseCsv(is, reconciliationId, storedFile.getId(), sourceType, userMappings);
        } else if (ext.equals("pdf")) {
            storedFile.setProcessingMethod("PDF_TEXT_EXTRACTION");
            parsedTransactions = pdfParser.parsePdf(is, reconciliationId, storedFile.getId(), sourceType, pdfPassword);
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + ext);
        }

        transactionRepository.saveAll(parsedTransactions);

        storedFile.setProcessingStatus("PARSED");
        return fileRepository.save(storedFile);
    }
}
