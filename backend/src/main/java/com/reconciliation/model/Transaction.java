package com.reconciliation.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String reconciliationId;
    private String fileId;
    private String source; // ACCOUNTING, BANK

    private LocalDate transactionDate;
    private LocalDate valueDate;

    private String description;
    private String rawDescription;
    private String normalizedDescription;

    private Double debit;
    private Double credit;
    private Double amount;
    private String transactionType; // DEBIT, CREDIT

    private String referenceNumber;
    private String chequeNumber;
    private Double balance;

    private int originalRowNumber;
    private String status = "UNMATCHED"; // UNMATCHED, MATCHED, POSSIBLE_MATCH, AMOUNT_MISMATCH, DATE_MISMATCH, DUPLICATE

    private boolean isLocked = false;
    private String matchedPairId;

    public Transaction() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(String reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public LocalDate getValueDate() { return valueDate; }
    public void setValueDate(LocalDate valueDate) { this.valueDate = valueDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRawDescription() { return rawDescription; }
    public void setRawDescription(String rawDescription) { this.rawDescription = rawDescription; }

    public String getNormalizedDescription() { return normalizedDescription; }
    public void setNormalizedDescription(String normalizedDescription) { this.normalizedDescription = normalizedDescription; }

    public Double getDebit() { return debit; }
    public void setDebit(Double debit) { this.debit = debit; }

    public Double getCredit() { return credit; }
    public void setCredit(Double credit) { this.credit = credit; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getChequeNumber() { return chequeNumber; }
    public void setChequeNumber(String chequeNumber) { this.chequeNumber = chequeNumber; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }

    public int getOriginalRowNumber() { return originalRowNumber; }
    public void setOriginalRowNumber(int originalRowNumber) { this.originalRowNumber = originalRowNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }

    public String getMatchedPairId() { return matchedPairId; }
    public void setMatchedPairId(String matchedPairId) { this.matchedPairId = matchedPairId; }
}
