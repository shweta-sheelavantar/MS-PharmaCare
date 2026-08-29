package com.auth.repository;

import com.auth.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderOrderId(String orderId);

    @org.springframework.data.jpa.repository.Query("SELECT oi.product, SUM(oi.quantity) as totalSold FROM OrderItem oi JOIN oi.order o WHERE o.status = 'Delivered' GROUP BY oi.product ORDER BY totalSold DESC")
    List<Object[]> findTopSellingMedicines(org.springframework.data.domain.Pageable pageable);
    
    @org.springframework.data.jpa.repository.Query("SELECT oi.product.category, SUM(oi.quantity) as totalSold FROM OrderItem oi JOIN oi.order o WHERE o.status = 'Delivered' GROUP BY oi.product.category ORDER BY totalSold DESC")
    List<Object[]> findMostOrderedCategories(org.springframework.data.domain.Pageable pageable);
}
