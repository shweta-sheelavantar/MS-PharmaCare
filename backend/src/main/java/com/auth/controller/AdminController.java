package com.auth.controller;

import com.auth.dto.admin.*;
import com.auth.entity.User;
import com.auth.exception.AuthException;
import com.auth.repository.CategoryRepository;
import com.auth.repository.OrderRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.UserRepository;
import com.auth.security.UserPrincipal;
import com.auth.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderRepository orderRepository;
    private final com.auth.service.AuthService authService;

    public AdminController(AdminService adminService, UserRepository userRepository,
                           ProductRepository productRepository, CategoryRepository categoryRepository,
                           OrderRepository orderRepository, com.auth.service.AuthService authService) {
        this.adminService = adminService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.authService = authService;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<com.auth.dto.ApiResponse<com.auth.dto.AuthResponse>> adminLogin(@Valid @RequestBody com.auth.dto.LoginRequest request) {
        com.auth.dto.AuthResponse response = authService.login(request);
        if (!"ADMIN".equals(response.getUser().getRole())) {
            throw new AuthException("Access Denied. Administrator privileges are required.");
        }
        return ResponseEntity.ok(com.auth.dto.ApiResponse.success("Admin login successful", response));
    }

    private void verifyAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("Access Denied"));
        if (!"ADMIN".equals(user.getRole())) {
            throw new AuthException("Access Denied");
        }
    }

    // =================================================
    // ADMIN DASHBOARD & STATS
    // =================================================
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getAdminStats());
    }

    // =================================================
    // MEDICINE / PRODUCT MANAGEMENT
    // =================================================
    @PostMapping("/medicines")
    public ResponseEntity<MedicineResponse> addMedicine(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody MedicineRequest request) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addMedicine(request));
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id, @Valid @RequestBody MedicineRequest request) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.updateMedicine(id, request));
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<Void> deleteMedicine(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        verifyAdmin(principal.getUser().getId());
        adminService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineResponse>> getAllMedicines(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getAllMedicines());
    }

    @GetMapping("/medicines/{id}")
    public ResponseEntity<MedicineResponse> getMedicineById(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getMedicineById(id));
    }

    @GetMapping("/medicines/search")
    public ResponseEntity<List<MedicineResponse>> searchMedicines(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String keyword) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.searchMedicines(keyword));
    }

    // =================================================
    // CATEGORY MANAGEMENT
    // =================================================
    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> addCategory(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody CategoryRequest request) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addCategory(request));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        verifyAdmin(principal.getUser().getId());
        adminService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getAllCategories());
    }

    // =================================================
    // USER MANAGEMENT
    // =================================================
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@AuthenticationPrincipal UserPrincipal principal, @RequestParam String keyword) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.searchUsers(keyword));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id, @RequestParam String role) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.updateUserRole(id, role));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id, @RequestParam boolean active) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.updateUserStatus(id, active));
    }

    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<Void> resetUserPassword(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id, @RequestParam String newPassword) {
        verifyAdmin(principal.getUser().getId());
        adminService.resetUserPassword(id, newPassword);
        return ResponseEntity.ok().build();
    }

    // =================================================
    // INVENTORY MANAGEMENT
    // =================================================
    @PutMapping("/inventory/update")
    public ResponseEntity<Void> updateInventory(@AuthenticationPrincipal UserPrincipal principal, @RequestParam Long medicineId, @RequestParam int quantity, @RequestParam boolean increase) {
        verifyAdmin(principal.getUser().getId());
        adminService.updateInventory(medicineId, quantity, increase);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<MedicineResponse>> getLowStockMedicines(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getLowStockMedicines());
    }

    @GetMapping("/inventory/out-of-stock")
    public ResponseEntity<List<MedicineResponse>> getOutOfStockMedicines(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getOutOfStockMedicines());
    }

    // =================================================
    // ORDER MANAGEMENT
    // =================================================
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getOrderById(id));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id, @RequestParam String status) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.updateOrderStatus(id, status));
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> cancelOrder(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id) {
        verifyAdmin(principal.getUser().getId());
        adminService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

    // =================================================
    // BUSINESS ANALYTICS
    // =================================================
    @GetMapping("/analytics/daily")
    public ResponseEntity<RevenueResponse> getDailyRevenue(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getDailyRevenue());
    }

    @GetMapping("/analytics/monthly")
    public ResponseEntity<RevenueResponse> getMonthlyRevenue(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getMonthlyRevenue());
    }

    @GetMapping("/analytics/yearly")
    public ResponseEntity<RevenueResponse> getYearlyRevenue(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getYearlyRevenue());
    }

    @GetMapping("/analytics/overall")
    public ResponseEntity<RevenueResponse> getOverallRevenue(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getOverallRevenue());
    }

    @GetMapping("/analytics/top-medicines")
    public ResponseEntity<List<AnalyticsResponse>> getTopSellingMedicines(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getTopSellingMedicines());
    }

    @GetMapping("/analytics/top-categories")
    public ResponseEntity<List<AnalyticsResponse>> getMostOrderedCategories(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getMostOrderedCategories());
    }

    // =================================================
    // ADMIN PROFILE
    // =================================================
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getAdminProfile(@AuthenticationPrincipal UserPrincipal principal) {
        verifyAdmin(principal.getUser().getId());
        return ResponseEntity.ok(adminService.getUserById(principal.getUser().getId())); 
    }
}
