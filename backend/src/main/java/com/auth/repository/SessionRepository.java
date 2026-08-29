package com.auth.repository;

import com.auth.entity.Session;
import com.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findBySessionIdAndActiveTrue(String sessionId);

    List<Session> findByUserAndActiveTrue(User user);

    @Modifying
    @Query("UPDATE Session s SET s.active = false, s.logoutTime = :logoutTime WHERE s.user = :user AND s.active = true")
    void deactivateAllByUser(@Param("user") User user, @Param("logoutTime") LocalDateTime logoutTime);

    @Modifying
    @Query("UPDATE Session s SET s.active = false, s.logoutTime = :logoutTime WHERE s.expiryTime < :now AND s.active = true")
    void deactivateExpiredSessions(@Param("now") LocalDateTime now, @Param("logoutTime") LocalDateTime logoutTime);
}
