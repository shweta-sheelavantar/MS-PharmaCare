package com.auth.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_otps")
public class PasswordResetOtp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "is_used", nullable = false)
    private boolean used;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public PasswordResetOtp() {}

    public PasswordResetOtp(Long id, User user, String otpHash, LocalDateTime expiresAt, boolean used, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.otpHash = otpHash;
        this.expiresAt = expiresAt;
        this.used = used;
        this.createdAt = createdAt;
    }

    public static PasswordResetOtpBuilder builder() {
        return new PasswordResetOtpBuilder();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOtpHash() {
        return otpHash;
    }

    public void setOtpHash(String otpHash) {
        this.otpHash = otpHash;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class PasswordResetOtpBuilder {
        private Long id;
        private User user;
        private String otpHash;
        private LocalDateTime expiresAt;
        private boolean used;
        private LocalDateTime createdAt;

        public PasswordResetOtpBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PasswordResetOtpBuilder user(User user) {
            this.user = user;
            return this;
        }

        public PasswordResetOtpBuilder otpHash(String otpHash) {
            this.otpHash = otpHash;
            return this;
        }

        public PasswordResetOtpBuilder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public PasswordResetOtpBuilder used(boolean used) {
            this.used = used;
            return this;
        }

        public PasswordResetOtpBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PasswordResetOtp build() {
            return new PasswordResetOtp(id, user, otpHash, expiresAt, used, createdAt);
        }
    }
}
