package com.auth.config;

import com.auth.entity.User;
import com.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Optional<User> adminOpt = userRepository.findByEmail("admin@admin.com");
        
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setUserName("Super Admin");
            admin.setEmail("admin@admin.com");
            admin.setMobileNumber("0000000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            
            userRepository.save(admin);
            System.out.println("Default Admin Account Created!");
            System.out.println("Email: admin@admin.com");
            System.out.println("Password: admin123");
        } else {
            // Force update existing user to ensure they are an ADMIN and the password is correct
            User admin = adminOpt.get();
            admin.setRole("ADMIN");
            admin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("Admin Account Updated!");
            System.out.println("Email: admin@admin.com");
            System.out.println("Password: admin123");
        }
    }
}
