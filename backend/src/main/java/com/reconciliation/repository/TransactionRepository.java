package com.reconciliation.repository;

import com.reconciliation.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByReconciliationId(String reconciliationId);
    List<Transaction> findByReconciliationIdAndSource(String reconciliationId, String source);
    List<Transaction> findByReconciliationIdAndStatus(String reconciliationId, String status);
    void deleteByReconciliationId(String reconciliationId);
    long countByReconciliationIdAndStatus(String reconciliationId, String status);
}
