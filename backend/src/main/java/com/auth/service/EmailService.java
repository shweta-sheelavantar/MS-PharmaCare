package com.auth.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Value("${spring.mail.username:}")
    private String fromEmail;

    /**
     * Sends OTP via email using HTML format with MS PharmCare branding.
     * Falls back to console logging if mail username is not configured or sending fails.
     */
    public void sendOtpEmail(String toEmail, String otp) {
        // Always log OTP to console for developer reference
        log.info("====================================================");
        log.info(" [MS PHARMCARE AUTH] Password Reset OTP for {}: {}", toEmail, otp);
        log.info("====================================================");

        if (fromEmail == null || fromEmail.isBlank()) {
            log.warn("[EMAIL-SERVICE] Mail username ('spring.mail.username') is not configured. OTP only printed in console.");
            return;
        }

        try {
            log.info("[EMAIL-SERVICE] Attempting to send OTP email from '{}' to '{}'...", fromEmail, toEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("MS PharmCare - Your Password Reset OTP");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);\">"
                    + "<div style=\"text-align: center; margin-bottom: 20px;\">"
                    + "<h2 style=\"color: #0f766e; font-size: 24px; margin: 0;\">&#127807; MS PharmCare</h2>"
                    + "<p style=\"color: #64748b; font-size: 14px; margin-top: 4px;\">Healthcare & Wellness Portal</p>"
                    + "</div>"
                    + "<hr style=\"border: none; border-top: 1px solid #f1f5f9; margin-bottom: 20px;\" />"
                    + "<h3 style=\"color: #1e293b; font-size: 18px; margin-bottom: 8px;\">Password Reset Request</h3>"
                    + "<p style=\"color: #475569; font-size: 15px; line-height: 1.5;\">You requested a password reset code for your account. Please use the Verification OTP below:</p>"
                    + "<div style=\"text-align: center; margin: 28px 0;\">"
                    + "<span style=\"display: inline-block; background: linear-gradient(135deg, #0d9488, #0f766e); color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);\">" + otp + "</span>"
                    + "</div>"
                    + "<p style=\"color: #64748b; font-size: 14px;\">&#9200; This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>"
                    + "<p style=\"color: #94a3b8; font-size: 13px; margin-top: 24px;\">If you did not request this password reset, you can safely ignore this email.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("[EMAIL-SERVICE] ✅ Successfully sent OTP email to '{}'", toEmail);

        } catch (MailException e) {
            log.error("[EMAIL-SERVICE] ❌ MailException sending OTP to '{}': {}", toEmail, e.getMessage());
            log.error("[EMAIL-SERVICE] Root cause: {}", e.getMostSpecificCause().getMessage());
            log.info("[EMAIL-SERVICE] Fallback: OTP for {} is {} (check console above)", toEmail, otp);
        } catch (Exception e) {
            log.error("[EMAIL-SERVICE] ❌ Unexpected error sending OTP to '{}': {}", toEmail, e.getMessage(), e);
            log.info("[EMAIL-SERVICE] Fallback: OTP for {} is {} (check console above)", toEmail, otp);
        }
    }

    public void sendOrderConfirmationEmail(String toEmail, String orderId, String amount) {
        if (fromEmail == null || fromEmail.isBlank()) {
            log.warn("[EMAIL-SERVICE] Mail username not configured. Order confirmation not sent.");
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("MS PharmCare - Order Confirmed (" + orderId + ")");
            String content = "<p>Your order <strong>" + orderId + "</strong> has been confirmed.</p><p>Total Paid: ₹" + amount + "</p>";
            helper.setText(content, true);
            mailSender.send(message);
            log.info("[EMAIL-SERVICE] ✅ Successfully sent order confirmation to '{}'", toEmail);
        } catch (Exception e) {
            log.error("[EMAIL-SERVICE] ❌ Error sending order confirmation to '{}': {}", toEmail, e.getMessage(), e);
        }
    }
}
