package com.reconciliation.repository;

import com.reconciliation.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByReconciliationId(String reconciliationId);
    List<Match> findByReconciliationIdAndStatus(String reconciliationId, String status);
    Optional<Match> findByAccountingTransactionIdOrBankTransactionId(String accId, String bankId);
    void deleteByReconciliationId(String reconciliationId);
}
