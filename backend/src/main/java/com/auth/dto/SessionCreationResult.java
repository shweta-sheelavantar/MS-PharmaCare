package com.auth.dto;

import com.auth.entity.Session;

public class SessionCreationResult {

    private final Session session;
    private final String token;

    public SessionCreationResult(Session session, String token) {
        this.session = session;
        this.token = token;
    }

    public Session getSession() {
        return session;
    }

    public String getToken() {
        return token;
    }
}
