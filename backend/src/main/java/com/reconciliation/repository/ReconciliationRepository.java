package com.reconciliation.repository;

import com.reconciliation.model.Reconciliation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReconciliationRepository extends MongoRepository<Reconciliation, String> {
    List<Reconciliation> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Reconciliation> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
