package com.reconciliation.controller;

import com.reconciliation.config.JwtTokenProvider;
import com.reconciliation.model.User;
import com.reconciliation.repository.UserRepository;
import com.reconciliation.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final AuditService auditService;
    private final JwtTokenProvider jwtTokenProvider;

    public AdminController(UserRepository userRepository, AuditService auditService, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader(value = "Authorization", required = false) String token) {
        String adminId = null;
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.replace("Bearer ", "");
            adminId = jwtTokenProvider.getUserIdFromToken(jwt);
        }

        if (adminId != null) {
            // Strictly return ONLY users working under this admin
            List<User> managedUsers = userRepository.findByAdminId(adminId);
            return ResponseEntity.ok(managedUsers);
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/pending-requests")
    public ResponseEntity<?> getPendingRequests(@RequestHeader(value = "Authorization", required = false) String token) {
        String adminId = null;
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.replace("Bearer ", "");
            adminId = jwtTokenProvider.getUserIdFromToken(jwt);
        }

        List<User> pendingList;
        if (adminId != null) {
            pendingList = userRepository.findByAdminIdAndApprovalStatus(adminId, "PENDING_APPROVAL");
        } else {
            pendingList = List.of();
        }

        return ResponseEntity.ok(pendingList);
    }

    @GetMapping("/pending-count")
    public ResponseEntity<?> getPendingCount(@RequestHeader(value = "Authorization", required = false) String token) {
        String adminId = null;
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.replace("Bearer ", "");
            adminId = jwtTokenProvider.getUserIdFromToken(jwt);
        }

        List<User> pendingList;
        if (adminId != null) {
            pendingList = userRepository.findByAdminIdAndApprovalStatus(adminId, "PENDING_APPROVAL");
        } else {
            pendingList = List.of();
        }

        return ResponseEntity.ok(Map.of("count", pendingList.size()));
    }

    @PostMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable String id,
                                         @RequestHeader(value = "Authorization", required = false) String token) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        user.setApprovalStatus("APPROVED");
        user.setActive(true);
        userRepository.save(user);

        String adminEmail = "ADMIN";
        if (token != null && token.startsWith("Bearer ")) {
            adminEmail = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        }

        auditService.logAction(user.getId(), user.getEmail(), "USER_APPROVED", "User " + user.getEmail() + " registration approved by Admin " + adminEmail);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users/{id}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable String id,
                                        @RequestHeader(value = "Authorization", required = false) String token) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        user.setApprovalStatus("REJECTED");
        user.setActive(false);
        userRepository.save(user);

        String adminEmail = "ADMIN";
        if (token != null && token.startsWith("Bearer ")) {
            adminEmail = jwtTokenProvider.getEmailFromToken(token.replace("Bearer ", ""));
        }

        auditService.logAction(user.getId(), user.getEmail(), "USER_REJECTED", "User " + user.getEmail() + " registration rejected by Admin " + adminEmail);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        User user = userOpt.get();
        user.setActive(!user.isActive());
        if (user.isActive()) {
            user.setApprovalStatus("APPROVED");
        }
        userRepository.save(user);

        auditService.logAction("ADMIN", "ADMIN", "USER_STATUS_TOGGLED", "User " + user.getEmail() + " status set to active=" + user.isActive());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(@RequestHeader(value = "Authorization", required = false) String token) {
        String adminId = null;
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.replace("Bearer ", "");
            adminId = jwtTokenProvider.getUserIdFromToken(jwt);
        }

        if (adminId != null) {
            List<User> managedUsers = userRepository.findByAdminId(adminId);
            List<String> userIds = new java.util.ArrayList<>();
            userIds.add(adminId);
            for (User u : managedUsers) {
                if (u.getId() != null) userIds.add(u.getId());
            }
            return ResponseEntity.ok(auditService.getLogsForUsers(userIds));
        }
        return ResponseEntity.ok(List.of());
    }
}
