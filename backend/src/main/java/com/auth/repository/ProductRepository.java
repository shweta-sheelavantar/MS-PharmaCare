package com.auth.repository;

import com.auth.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryCategoryId(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    java.util.Optional<Product> findByName(String name);
    boolean existsByName(String name);
    List<Product> findByStockLessThanEqual(Integer stock);
    List<Product> findByStock(Integer stock);
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);
}
