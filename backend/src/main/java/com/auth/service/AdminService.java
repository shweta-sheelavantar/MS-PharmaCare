package com.auth.service;

import com.auth.dto.admin.*;
import java.util.List;

public interface AdminService {

    // Dashboard
    DashboardResponse getDashboard();
    AdminStatsResponse getAdminStats();

    // Medicine Management
    MedicineResponse addMedicine(MedicineRequest request);
    MedicineResponse updateMedicine(Long id, MedicineRequest request);
    void deleteMedicine(Long id);
    List<MedicineResponse> getAllMedicines();
    MedicineResponse getMedicineById(Long id);
    List<MedicineResponse> searchMedicines(String keyword);

    // Category Management
    CategoryResponse addCategory(CategoryRequest request);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
    List<CategoryResponse> getAllCategories();

    // User Management
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    List<UserResponse> searchUsers(String keyword);
    UserResponse updateUserRole(Long id, String role);
    UserResponse updateUserStatus(Long id, boolean active);
    void resetUserPassword(Long id, String newPassword);

    // Inventory Management
    void updateInventory(Long medicineId, int quantity, boolean increase);
    List<MedicineResponse> getLowStockMedicines();
    List<MedicineResponse> getOutOfStockMedicines();

    // Order Management
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(String orderId);
    OrderResponse updateOrderStatus(String orderId, String status);
    void cancelOrder(String orderId);

    // Business Analytics
    RevenueResponse getDailyRevenue();
    RevenueResponse getMonthlyRevenue();
    RevenueResponse getYearlyRevenue();
    RevenueResponse getOverallRevenue();
    List<AnalyticsResponse> getTopSellingMedicines();
    List<AnalyticsResponse> getMostOrderedCategories();
}
