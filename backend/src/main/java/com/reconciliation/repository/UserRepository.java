package com.reconciliation.repository;

import com.reconciliation.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(String role);
    List<User> findByAdminId(String adminId);
    List<User> findByAdminIdAndApprovalStatus(String adminId, String approvalStatus);
    List<User> findByApprovalStatus(String approvalStatus);
    Optional<User> findByNameIgnoreCaseAndRole(String name, String role);
    Optional<User> findByEmailIgnoreCaseAndRole(String email, String role);
}
