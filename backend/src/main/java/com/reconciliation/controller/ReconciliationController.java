package com.reconciliation.controller;

import com.reconciliation.config.JwtTokenProvider;
import com.reconciliation.model.Reconciliation;
import com.reconciliation.model.StoredFile;
import com.reconciliation.model.Transaction;
import com.reconciliation.repository.FileRepository;
import com.reconciliation.repository.MatchRepository;
import com.reconciliation.repository.ReconciliationRepository;
import com.reconciliation.repository.TransactionRepository;
import com.reconciliation.service.AuditService;
import com.reconciliation.service.FileProcessingService;
import com.reconciliation.service.MatchingEngineService;
import com.reconciliation.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reconciliations")
@CrossOrigin(origins = "*")
public class ReconciliationController {

    private static final Logger logger = LoggerFactory.getLogger(ReconciliationController.class);

    private final ReconciliationRepository reconciliationRepository;
    private final FileRepository fileRepository;
    private final TransactionRepository transactionRepository;
    private final MatchRepository matchRepository;
    private final FileProcessingService fileProcessingService;
    private final MatchingEngineService matchingEngineService;
    private final ReportService reportService;
    private final AuditService auditService;
    private final JwtTokenProvider jwtTokenProvider;

    public ReconciliationController(ReconciliationRepository reconciliationRepository,
                                  FileRepository fileRepository,
                                  TransactionRepository transactionRepository,
                                  MatchRepository matchRepository,
                                  FileProcessingService fileProcessingService,
                                  MatchingEngineService matchingEngineService,
                                  ReportService reportService,
                                  AuditService auditService,
                                  JwtTokenProvider jwtTokenProvider) {
        this.reconciliationRepository = reconciliationRepository;
        this.fileRepository = fileRepository;
        this.transactionRepository = transactionRepository;
        this.matchRepository = matchRepository;
        this.fileProcessingService = fileProcessingService;
        this.matchingEngineService = matchingEngineService;
        this.reportService = reportService;
        this.auditService = auditService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping
    public ResponseEntity<?> createReconciliation(@RequestBody Map<String, String> request,
                                                  @RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            String userId = jwtTokenProvider.getUserIdFromToken(jwt);
            String userEmail = jwtTokenProvider.getEmailFromToken(jwt);

            Reconciliation recon = new Reconciliation();
            recon.setUserId(userId);
            recon.setName(request.get("name"));
            recon.setCompanyName(request.get("companyName"));
            recon.setPeriodStart(LocalDate.parse(request.get("periodStart")));
            recon.setPeriodEnd(LocalDate.parse(request.get("periodEnd")));
            recon.setStatus("DRAFT");

            reconciliationRepository.save(recon);
            auditService.logAction(userId, userEmail, "RECONCILIATION_STARTED", "Created reconciliation: " + recon.getName());

            return ResponseEntity.ok(recon);
        } catch (Exception e) {
            logger.error("Create Reconciliation Error", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to create session: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getReconciliations(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);

        return ResponseEntity.ok(reconciliationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReconciliationById(@PathVariable String id,
                                                  @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);

        Optional<Reconciliation> recon = reconciliationRepository.findById(id);
        if (recon.isEmpty()) return ResponseEntity.notFound().build();

        if (!userId.equals(recon.get().getUserId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied: Unauthorized reconciliation session"));
        }

        return ResponseEntity.ok(recon.get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReconciliation(@PathVariable String id,
                                                  @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);

        Optional<Reconciliation> recon = reconciliationRepository.findById(id);
        if (recon.isEmpty()) return ResponseEntity.notFound().build();

        if (!userId.equals(recon.get().getUserId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        reconciliationRepository.deleteById(id);
        fileRepository.deleteByReconciliationId(id);
        transactionRepository.deleteByReconciliationId(id);
        matchRepository.deleteByReconciliationId(id);
        return ResponseEntity.ok(Map.of("message", "Reconciliation deleted successfully"));
    }

    @PostMapping("/{id}/accounting-file")
    public ResponseEntity<?> uploadAccountingFile(@PathVariable String id,
                                                  @RequestParam("file") MultipartFile file,
                                                  @RequestParam(value = "password", required = false) String password) {
        try {
            StoredFile storedFile = fileProcessingService.processAndSaveFile(id, "ACCOUNTING", file, null, password);

            Optional<Reconciliation> reconOpt = reconciliationRepository.findById(id);
            if (reconOpt.isPresent()) {
                Reconciliation r = reconOpt.get();
                r.setAccountingFileId(storedFile.getId());
                reconciliationRepository.save(r);
            }

            return ResponseEntity.ok(storedFile);
        } catch (Exception e) {
            logger.error("Accounting File Upload/Parse Error", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Accounting File error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/bank-file")
    public ResponseEntity<?> uploadBankFile(@PathVariable String id,
                                            @RequestParam("file") MultipartFile file,
                                            @RequestParam(value = "password", required = false) String password) {
        try {
            StoredFile storedFile = fileProcessingService.processAndSaveFile(id, "BANK", file, null, password);

            Optional<Reconciliation> reconOpt = reconciliationRepository.findById(id);
            if (reconOpt.isPresent()) {
                Reconciliation r = reconOpt.get();
                r.setBankFileId(storedFile.getId());
                reconciliationRepository.save(r);
            }

            return ResponseEntity.ok(storedFile);
        } catch (Exception e) {
            logger.error("Bank File Upload/Parse Error", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Bank File error: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<?> processReconciliation(@PathVariable String id) {
        try {
            matchingEngineService.runReconciliation(id);
            Optional<Reconciliation> updated = reconciliationRepository.findById(id);
            return ResponseEntity.ok(updated.get());
        } catch (Exception e) {
            logger.error("Reconciliation Processing Error", e);
            return ResponseEntity.badRequest().body(Map.of("message", "Matching Engine error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable String id,
                                             @RequestParam(value = "source", required = false) String source,
                                             @RequestParam(value = "status", required = false) String status) {
        List<Transaction> list;
        if (source != null && status != null) {
            list = transactionRepository.findByReconciliationIdAndStatus(id, status).stream()
                    .filter(t -> t.getSource().equalsIgnoreCase(source)).toList();
        } else if (source != null) {
            list = transactionRepository.findByReconciliationIdAndSource(id, source);
        } else if (status != null) {
            list = transactionRepository.findByReconciliationIdAndStatus(id, status);
        } else {
            list = transactionRepository.findByReconciliationId(id);
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<?> getMatches(@PathVariable String id) {
        return ResponseEntity.ok(matchRepository.findByReconciliationId(id));
    }

    @GetMapping("/{id}/report/pdf")
    public ResponseEntity<?> downloadPdfReport(@PathVariable String id) {
        try {
            ByteArrayInputStream pdf = reportService.generatePdfReport(id);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=reconciliation-report-" + id + ".pdf");
            return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF).body(new InputStreamResource(pdf));
        } catch (Exception e) {
            logger.error("PDF Report Error", e);
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/report/excel")
    public ResponseEntity<?> downloadExcelReport(@PathVariable String id) {
        try {
            ByteArrayInputStream excel = reportService.generateExcelReport(id);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=reconciliation-report-" + id + ".xlsx");
            return ResponseEntity.ok().headers(headers).contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(new InputStreamResource(excel));
        } catch (Exception e) {
            logger.error("Excel Report Error", e);
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
