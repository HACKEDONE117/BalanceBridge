package com.reconciliation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "matches")
public class Match {

    @Id
    private String id;
    private String reconciliationId;
    private String accountingTransactionId;
    private String bankTransactionId;

    private double score; // 0 - 100
    private String matchType; // EXACT, HIGH_CONFIDENCE, POSSIBLE, MANUAL, AMOUNT_MISMATCH, DATE_MISMATCH
    
    private List<String> matchReasons = new ArrayList<>();
    private String matchedBy; // AUTO, USER_ID
    private String status = "PENDING"; // PENDING, CONFIRMED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();

    public Match() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(String reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getAccountingTransactionId() { return accountingTransactionId; }
    public void setAccountingTransactionId(String accountingTransactionId) { this.accountingTransactionId = accountingTransactionId; }

    public String getBankTransactionId() { return bankTransactionId; }
    public void setBankTransactionId(String bankTransactionId) { this.bankTransactionId = bankTransactionId; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }

    public List<String> getMatchReasons() { return matchReasons; }
    public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }

    public String getMatchedBy() { return matchedBy; }
    public void setMatchedBy(String matchedBy) { this.matchedBy = matchedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
