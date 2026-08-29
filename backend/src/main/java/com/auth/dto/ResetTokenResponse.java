package com.auth.dto;

public class ResetTokenResponse {

    private String resetToken;

    public ResetTokenResponse() {}

    public ResetTokenResponse(String resetToken) {
        this.resetToken = resetToken;
    }

    public static ResetTokenResponseBuilder builder() {
        return new ResetTokenResponseBuilder();
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public static class ResetTokenResponseBuilder {
        private String resetToken;

        public ResetTokenResponseBuilder resetToken(String resetToken) {
            this.resetToken = resetToken;
            return this;
        }

        public ResetTokenResponse build() {
            return new ResetTokenResponse(resetToken);
        }
    }
}
