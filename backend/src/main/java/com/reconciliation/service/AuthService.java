package com.reconciliation.service;

import com.reconciliation.config.JwtTokenProvider;
import com.reconciliation.model.User;
import com.reconciliation.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public Map<String, Object> register(String name, String email, String password, String role, String adminInput) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String userRole = (role != null && role.equalsIgnoreCase("ADMIN")) ? "ADMIN" : "USER";
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(userRole);

        if ("USER".equals(userRole)) {
            if (adminInput == null || adminInput.trim().isEmpty()) {
                throw new IllegalArgumentException("Please enter the System Administrator's Name or Email you work under");
            }
            String input = adminInput.trim();
            Optional<User> adminOpt = userRepository.findByEmailIgnoreCaseAndRole(input, "ADMIN");
            if (adminOpt.isEmpty()) {
                adminOpt = userRepository.findByNameIgnoreCaseAndRole(input, "ADMIN");
            }
            if (adminOpt.isEmpty()) {
                adminOpt = userRepository.findById(input).filter(u -> "ADMIN".equals(u.getRole()));
            }
            if (adminOpt.isEmpty()) {
                // Partial match search
                adminOpt = userRepository.findByRole("ADMIN").stream()
                        .filter(u -> u.getName().toLowerCase().contains(input.toLowerCase()) ||
                                u.getEmail().toLowerCase().contains(input.toLowerCase()))
                        .findFirst();
            }
            if (adminOpt.isEmpty()) {
                throw new IllegalArgumentException("No System Administrator found matching '" + input + "'. Please check the Administrator's Name or Email.");
            }
            User admin = adminOpt.get();
            user.setAdminId(admin.getId());
            user.setApprovalStatus("PENDING_APPROVAL");
            user.setActive(false);
        } else {
            user.setApprovalStatus("APPROVED");
            user.setActive(true);
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("approvalStatus", user.getApprovalStatus());

        if ("APPROVED".equals(user.getApprovalStatus()) && user.isActive()) {
            String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
            response.put("token", token);
        } else {
            response.put("message", "Registration submitted! Your account is pending approval by your System Administrator.");
        }

        return response;
    }

    public Map<String, Object> login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        User user = userOpt.get();
        if ("PENDING_APPROVAL".equals(user.getApprovalStatus())) {
            throw new IllegalArgumentException("Your registration request is pending approval by your System Administrator.");
        }
        if ("REJECTED".equals(user.getApprovalStatus())) {
            throw new IllegalArgumentException("Your registration request was rejected by your System Administrator.");
        }
        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is deactivated");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        return response;
    }
}
