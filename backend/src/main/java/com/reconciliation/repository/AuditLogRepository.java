package com.reconciliation.repository;

import com.reconciliation.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findTop20ByOrderByTimestampDesc();
    List<AuditLog> findByUserIdOrderByTimestampDesc(String userId);
}
