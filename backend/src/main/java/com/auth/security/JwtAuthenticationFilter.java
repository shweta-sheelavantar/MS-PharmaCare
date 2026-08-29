package com.auth.security;

import com.auth.entity.Session;
import com.auth.entity.User;
import com.auth.repository.SessionRepository;
import com.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository, SessionRepository sessionRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        logger.info("[JWT-FILTER] Processing Auth Header: " + (authHeader != null ? "Present" : "Missing"));
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            boolean isValid = jwtService.isTokenValid(token);
            String tokenType = jwtService.extractTokenType(token);
            logger.info("[JWT-FILTER] Token Valid: " + isValid + ", Type: " + tokenType);

            if (isValid && "access".equals(tokenType)) {
                String sessionId = jwtService.extractSessionId(token);
                Long userId = jwtService.extractUserId(token);
                logger.info("[JWT-FILTER] Session ID: " + sessionId + ", User ID: " + userId);

                Session session = sessionRepository.findBySessionIdAndActiveTrue(sessionId)
                        .orElse(null);
                logger.info("[JWT-FILTER] Active Session Found in DB: " + (session != null));

                if (session != null) {
                    logger.info("[JWT-FILTER] Expiry Check: " + session.getExpiryTime() + " vs Now: " + LocalDateTime.now());
                }

                if (session != null && session.getExpiryTime().isAfter(LocalDateTime.now())) {
                    User user = userRepository.findById(userId).orElse(null);
                    logger.info("[JWT-FILTER] User Found in DB: " + (user != null));

                    if (user != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserPrincipal principal = new UserPrincipal(user, sessionId);
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        principal, null, principal.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("[JWT-FILTER] Authentication SET in SecurityContextHolder for user: " + user.getEmail());
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Could not set user authentication in security context", e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
