package com.auth.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, unique = true, length = 36)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "jwt_token_hash", nullable = false)
    private String jwtTokenHash;

    @Column(name = "login_time", nullable = false)
    private LocalDateTime loginTime;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "logout_time")
    private LocalDateTime logoutTime;

    public Session() {}

    public Session(Long id, String sessionId, User user, String jwtTokenHash, LocalDateTime loginTime, LocalDateTime expiryTime, boolean active, LocalDateTime logoutTime) {
        this.id = id;
        this.sessionId = sessionId;
        this.user = user;
        this.jwtTokenHash = jwtTokenHash;
        this.loginTime = loginTime;
        this.expiryTime = expiryTime;
        this.active = active;
        this.logoutTime = logoutTime;
    }

    public static SessionBuilder builder() {
        return new SessionBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getJwtTokenHash() {
        return jwtTokenHash;
    }

    public void setJwtTokenHash(String jwtTokenHash) {
        this.jwtTokenHash = jwtTokenHash;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getLogoutTime() {
        return logoutTime;
    }

    public void setLogoutTime(LocalDateTime logoutTime) {
        this.logoutTime = logoutTime;
    }

    public static class SessionBuilder {
        private Long id;
        private String sessionId;
        private User user;
        private String jwtTokenHash;
        private LocalDateTime loginTime;
        private LocalDateTime expiryTime;
        private boolean active;
        private LocalDateTime logoutTime;

        public SessionBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public SessionBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public SessionBuilder user(User user) {
            this.user = user;
            return this;
        }

        public SessionBuilder jwtTokenHash(String jwtTokenHash) {
            this.jwtTokenHash = jwtTokenHash;
            return this;
        }

        public SessionBuilder loginTime(LocalDateTime loginTime) {
            this.loginTime = loginTime;
            return this;
        }

        public SessionBuilder expiryTime(LocalDateTime expiryTime) {
            this.expiryTime = expiryTime;
            return this;
        }

        public SessionBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public SessionBuilder logoutTime(LocalDateTime logoutTime) {
            this.logoutTime = logoutTime;
            return this;
        }

        public Session build() {
            return new Session(id, sessionId, user, jwtTokenHash, loginTime, expiryTime, active, logoutTime);
        }
    }
}
