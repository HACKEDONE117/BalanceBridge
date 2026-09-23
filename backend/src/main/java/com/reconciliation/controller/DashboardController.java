package com.reconciliation.controller;

import com.reconciliation.config.JwtTokenProvider;
import com.reconciliation.model.Reconciliation;
import com.reconciliation.repository.ReconciliationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final ReconciliationRepository reconciliationRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public DashboardController(ReconciliationRepository reconciliationRepository,
                               JwtTokenProvider jwtTokenProvider) {
        this.reconciliationRepository = reconciliationRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping
    public ResponseEntity<?> getDashboardStats(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtTokenProvider.getUserIdFromToken(jwt);

        // Fetch ONLY reconciliations belonging to the logged-in user
        List<Reconciliation> userRecons = reconciliationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        long totalReconciliations = userRecons.size();
        long completedCount = userRecons.stream().filter(r -> "COMPLETED".equals(r.getStatus())).count();
        long pendingCount = userRecons.stream().filter(r -> "PROCESSING".equals(r.getStatus()) || "DRAFT".equals(r.getStatus())).count();

        long totalMatched = 0;
        long totalUnmatched = 0;
        long totalMismatched = 0;
        long totalDuplicates = 0;

        for (Reconciliation r : userRecons) {
            Map<String, Object> sum = r.getSummary();
            if (sum != null) {
                totalMatched += getLongValue(sum.get("matchedCount"));
                totalUnmatched += getLongValue(sum.get("missingInBankCount")) + getLongValue(sum.get("missingInAccountingCount"));
                totalMismatched += getLongValue(sum.get("amountMismatchCount"));
                totalDuplicates += getLongValue(sum.get("duplicateCount"));
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReconciliations", totalReconciliations);
        stats.put("completedCount", completedCount);
        stats.put("pendingCount", pendingCount);
        stats.put("matchedTransactions", totalMatched);
        stats.put("unmatchedTransactions", totalUnmatched);
        stats.put("mismatchedTransactions", totalMismatched);
        stats.put("duplicateTransactions", totalDuplicates);
        stats.put("recentReconciliations", userRecons.stream().limit(5).toList());

        return ResponseEntity.ok(stats);
    }

    private long getLongValue(Object obj) {
        if (obj == null) return 0L;
        if (obj instanceof Number) return ((Number) obj).longValue();
        try {
            return Long.parseLong(obj.toString());
        } catch (Exception e) {
            return 0L;
        }
    }
}
