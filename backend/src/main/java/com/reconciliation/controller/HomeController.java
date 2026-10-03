package com.reconciliation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<?> home() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "system", "BalanceBridge API",
            "message", "BalanceBridge Backend is running successfully!"
        ));
    }

    @GetMapping("/api/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
