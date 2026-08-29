package com.auth.dto;

import java.time.LocalDateTime;

public class AuthResponse {

    private String token;
    private String sessionId;
    private LocalDateTime expiresAt;
    private UserResponse user;

    public AuthResponse() {}

    public AuthResponse(String token, String sessionId, LocalDateTime expiresAt, UserResponse user) {
        this.token = token;
        this.sessionId = sessionId;
        this.expiresAt = expiresAt;
        this.user = user;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public static class AuthResponseBuilder {
        private String token;
        private String sessionId;
        private LocalDateTime expiresAt;
        private UserResponse user;

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public AuthResponseBuilder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public AuthResponseBuilder user(UserResponse user) {
            this.user = user;
            return this;
        }

        public AuthResponse build() {
            return new AuthResponse(token, sessionId, expiresAt, user);
        }
    }
}
