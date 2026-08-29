package com.auth.repository;

import com.auth.entity.Wishlist;
import com.auth.entity.User;
import com.auth.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Wishlist w WHERE w.user = :user AND w.product = :product")
    void deleteByUserAndProduct(@org.springframework.data.repository.query.Param("user") User user, @org.springframework.data.repository.query.Param("product") Product product);
}
