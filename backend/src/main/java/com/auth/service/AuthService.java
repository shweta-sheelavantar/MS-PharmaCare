package com.auth.service;

import com.auth.dto.*;
import com.auth.entity.User;
import com.auth.exception.AuthException;
import com.auth.repository.UserRepository;
import com.auth.security.JwtService;
import com.auth.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       SessionService sessionService,
                       OtpService otpService,
                       JwtService jwtService,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionService = sessionService;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.userMapper = userMapper;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Password and confirm password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email is already registered");
        }

        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new AuthException("Mobile number is already registered");
        }

        String role = request.getRole();
        if (role == null || role.trim().isEmpty()) {
            role = "CUSTOMER";
        } else {
            role = role.trim().toUpperCase();
        }

        User user = User.builder()
                .userName(request.getUserName())
                .email(request.getEmail().toLowerCase())
                .mobileNumber(request.getMobileNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getEmail() != null ? request.getEmail().trim() : "";
        log.info("[AUTH-LOGIN-ATTEMPT] Identifier: '{}'", identifier);

        User user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> {
                    log.warn("[AUTH-LOGIN-FAILED] User not found in MySQL for identifier: '{}'", identifier);
                    return new AuthException("Invalid credentials");
                });

        log.info("[AUTH-LOGIN-USER-FOUND] User ID: {}, Email: '{}'", user.getId(), user.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("[AUTH-LOGIN-FAILED] BCrypt password mismatch for user ID: {}", user.getId());
            throw new AuthException("Invalid credentials");
        }

        log.info("[AUTH-LOGIN-SUCCESS] Password verified via BCrypt for user ID: {}", user.getId());
        SessionCreationResult sessionResult = sessionService.createSession(user);

        return AuthResponse.builder()
                .token(sessionResult.getToken())
                .sessionId(sessionResult.getSession().getSessionId())
                .expiresAt(sessionResult.getSession().getExpiryTime())
                .user(userMapper.toResponse(user))
                .build();
    }

    @Transactional
    public void logout(UserPrincipal principal) {
        sessionService.logout(principal.getSessionId());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String identifier = request.getEmail() != null ? request.getEmail().trim() : "";
        log.info("[AUTH-FORGOT-PASSWORD] Request received for identifier: '{}'", identifier);

        var userOpt = userRepository.findByIdentifier(identifier);
        if (userOpt.isPresent()) {
            log.info("[AUTH-FORGOT-PASSWORD] User FOUND for identifier '{}', triggering OTP generation...", identifier);
            otpService.generateAndSendOtp(userOpt.get());
            log.info("[AUTH-FORGOT-PASSWORD] OTP generation + email send completed for identifier '{}'", identifier);
        } else {
            log.warn("[AUTH-FORGOT-PASSWORD] No user found for identifier '{}'. Returning success anyway (anti-enumeration).", identifier);
        }
        // Always return success to prevent user enumeration
    }

    @Transactional
    public ResetTokenResponse verifyOtp(VerifyOtpRequest request) {
        String identifier = request.getEmail() != null ? request.getEmail().trim() : "";
        User user = userRepository.findByIdentifier(identifier)
                .orElseThrow(() -> new AuthException("Invalid OTP"));

        User verifiedUser = otpService.verifyOtp(user.getEmail(), request.getOtp(), userRepository);
        String resetToken = jwtService.generateResetToken(verifiedUser.getId());
        return ResetTokenResponse.builder().resetToken(resetToken).build();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Password and confirm password do not match");
        }

        if (!jwtService.isTokenValid(request.getResetToken())
                || !"reset".equals(jwtService.extractTokenType(request.getResetToken()))) {
            throw new AuthException("Invalid or expired reset token");
        }

        Long userId = jwtService.extractUserId(request.getResetToken());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("Invalid reset token"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpService.markOtpAsUsed(user);
        sessionService.invalidateAllUserSessions(user);
    }

    @Transactional
    public void changePassword(UserPrincipal principal, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AuthException("Password and confirm password do not match");
        }

        User user = userRepository.findById(principal.getUser().getId())
                .orElseThrow(() -> new AuthException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AuthException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public UserResponse getCurrentUser(UserPrincipal principal) {
        return userMapper.toResponse(principal.getUser());
    }
}
