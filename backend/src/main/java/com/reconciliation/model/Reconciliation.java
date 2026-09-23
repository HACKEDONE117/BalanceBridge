package com.reconciliation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "reconciliations")
public class Reconciliation {

    @Id
    private String id;
    private String userId;
    private String name;
    private String companyName;
    private LocalDate periodStart;
    private LocalDate periodEnd;

    private String accountingFileId;
    private String bankFileId;

    private String status; // DRAFT, PROCESSING, COMPLETED, FAILED

    private MatchingConfig config = new MatchingConfig();

    // Summary Totals
    private Map<String, Object> summary = new HashMap<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Reconciliation() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

    public String getAccountingFileId() { return accountingFileId; }
    public void setAccountingFileId(String accountingFileId) { this.accountingFileId = accountingFileId; }

    public String getBankFileId() { return bankFileId; }
    public void setBankFileId(String bankFileId) { this.bankFileId = bankFileId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public MatchingConfig getConfig() { return config; }
    public void setConfig(MatchingConfig config) { this.config = config; }

    public Map<String, Object> getSummary() { return summary; }
    public void setSummary(Map<String, Object> summary) { this.summary = summary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
