package com.auth.service;

import com.auth.entity.PasswordResetOtp;
import com.auth.entity.User;
import com.auth.exception.AuthException;
import com.auth.repository.PasswordResetOtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);

    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public OtpService(PasswordResetOtpRepository otpRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Value("${otp.expiration-minutes}")
    private int otpExpirationMinutes;

    @Transactional
    public void generateAndSendOtp(User user) {
        log.info("[OTP-SERVICE] Generating OTP for user ID: {}, email: '{}'", user.getId(), user.getEmail());

        String otp = generateOtp();
        log.info("[OTP-SERVICE] Generated 6-digit OTP for user ID: {}", user.getId());

        PasswordResetOtp resetOtp = PasswordResetOtp.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(otpExpirationMinutes))
                .used(false)
                .build();

        otpRepository.save(resetOtp);
        log.info("[OTP-SERVICE] ✅ OTP saved to database for user ID: {}, expires in {} minutes", user.getId(), otpExpirationMinutes);

        // Send OTP via EmailService (will email if configured, or log fallback)
        emailService.sendOtpEmail(user.getEmail(), otp);
        log.info("[OTP-SERVICE] Email send step completed for user ID: {}", user.getId());
    }

    @Transactional
    public User verifyOtp(String email, String otp, com.auth.repository.UserRepository userRepository) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Invalid OTP"));

        PasswordResetOtp resetOtp = otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user)
                .orElseThrow(() -> new AuthException("Invalid OTP"));

        if (resetOtp.isUsed() || resetOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AuthException("OTP has expired");
        }

        if (!passwordEncoder.matches(otp, resetOtp.getOtpHash())) {
            throw new AuthException("Invalid OTP");
        }

        return user;
    }

    @Transactional
    public void markOtpAsUsed(User user) {
        otpRepository.findTopByUserAndUsedFalseOrderByCreatedAtDesc(user).ifPresent(otp -> {
            otp.setUsed(true);
            otpRepository.save(otp);
        });
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int value = 100000 + random.nextInt(900000);
        return String.valueOf(value);
    }
}
