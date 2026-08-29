package com.auth.service;

import com.auth.entity.Session;
import com.auth.entity.User;
import com.auth.repository.SessionRepository;
import com.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public SessionService(SessionRepository sessionRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.sessionRepository = sessionRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public com.auth.dto.SessionCreationResult createSession(User user) {
        String sessionId = UUID.randomUUID().toString();
        String token = jwtService.generateToken(user.getId(), sessionId);
        LocalDateTime loginTime = LocalDateTime.now();
        LocalDateTime expiryTime = jwtService.getExpirationFromToken(token);

        Session session = Session.builder()
                .sessionId(sessionId)
                .user(user)
                .jwtTokenHash(hashToken(token))
                .loginTime(loginTime)
                .expiryTime(expiryTime)
                .active(true)
                .build();

        return new com.auth.dto.SessionCreationResult(sessionRepository.save(session), token);
    }

    @Transactional
    public void logout(String sessionId) {
        sessionRepository.findBySessionIdAndActiveTrue(sessionId).ifPresent(session -> {
            session.setActive(false);
            session.setLogoutTime(LocalDateTime.now());
            sessionRepository.save(session);
        });
    }

    @Transactional
    public void invalidateAllUserSessions(User user) {
        sessionRepository.deactivateAllByUser(user, LocalDateTime.now());
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            return passwordEncoder.encode(token);
        }
    }
}
