package com.auth.repository;

import com.auth.entity.CartItem;
import com.auth.entity.Product;
import com.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    List<CartItem> findByUser(User user);

    boolean existsByUserAndProduct(User user, Product product);

    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM CartItem c WHERE c.user = :user AND c.product = :product")
    void deleteByUserAndProduct(@Param("user") User user, @Param("product") Product product);

    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM CartItem c WHERE c.user = :user")
    void deleteByUser(@Param("user") User user);

    @Query("SELECT SUM(c.quantity) FROM CartItem c WHERE c.user = :user")
    Integer sumQuantityByUser(@Param("user") User user);

    int countByUser(User user);
}
