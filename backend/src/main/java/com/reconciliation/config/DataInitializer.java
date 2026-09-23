package com.reconciliation.config;

import com.reconciliation.model.User;
import com.reconciliation.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            // Seed Admin User if email does not exist
            if (!userRepository.existsByEmail("admin@balancebridge.com")) {
                User admin = new User(
                        "System Admin",
                        "admin@balancebridge.com",
                        passwordEncoder.encode("admin123"),
                        "ADMIN"
                );
                userRepository.save(admin);
                System.out.println(">>> Seeded Admin User: admin@balancebridge.com / admin123");
            }

            // Seed Standard Accountant User if email does not exist
            if (!userRepository.existsByEmail("user@balancebridge.com")) {
                User user = new User(
                        "Demo Accountant",
                        "user@balancebridge.com",
                        passwordEncoder.encode("user123"),
                        "USER"
                );
                userRepository.save(user);
                System.out.println(">>> Seeded Accountant User: user@balancebridge.com / user123");
            }
        } catch (Exception e) {
            System.err.println(">>> Account Seeding Notice: " + e.getMessage());
        }
    }
}
