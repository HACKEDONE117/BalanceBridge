package com.reconciliation.controller;

import com.reconciliation.repository.UserRepository;
import com.reconciliation.service.AuthService;
import com.reconciliation.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public AuthController(AuthService authService, UserRepository userRepository, AuditService auditService) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @GetMapping("/administrators")
    public ResponseEntity<?> getAdministrators() {
        List<Map<String, String>> list = userRepository.findByRole("ADMIN").stream()
                .filter(u -> u.isActive())
                .map(u -> Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail()))
                .toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");
            String role = request.getOrDefault("role", "USER");
            String adminId = request.get("adminId");

            Map<String, Object> result = authService.register(name, email, password, role, adminId);
            auditService.logAction((String) result.get("userId"), email, "REGISTER", "New user registered (role: " + role + ")");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            Map<String, Object> result = authService.login(email, password);
            auditService.logAction((String) result.get("userId"), email, "LOGIN", "User logged in successfully");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
