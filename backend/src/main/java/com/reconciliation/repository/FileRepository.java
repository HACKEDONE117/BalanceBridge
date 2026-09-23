package com.reconciliation.repository;

import com.reconciliation.model.StoredFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FileRepository extends MongoRepository<StoredFile, String> {
    List<StoredFile> findByReconciliationId(String reconciliationId);
    void deleteByReconciliationId(String reconciliationId);
}
