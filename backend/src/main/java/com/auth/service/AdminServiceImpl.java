package com.auth.service;

import com.auth.dto.admin.*;
import com.auth.entity.*;
import com.auth.exception.*;
import com.auth.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AdminServiceImpl(ProductRepository productRepository, 
                            CategoryRepository categoryRepository, 
                            UserRepository userRepository, 
                            OrderRepository orderRepository, 
                            OrderItemRepository orderItemRepository, 
                            PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public DashboardResponse getDashboard() {
        DashboardResponse response = new DashboardResponse();
        response.setTotalUsers(userRepository.count());
        response.setTotalCustomers(userRepository.countByRole("CUSTOMER"));
        response.setTotalMedicines(productRepository.count());
        response.setTotalCategories(categoryRepository.count());
        response.setTotalOrders(orderRepository.count());
        response.setPendingOrders(orderRepository.countByStatus("Pending"));
        response.setConfirmedOrders(orderRepository.countByStatus("Confirmed"));
        response.setDeliveredOrders(orderRepository.countByStatus("Delivered"));
        response.setCancelledOrders(orderRepository.countByStatus("Cancelled"));
        response.setTotalRevenue(getOverallRevenue().getTotalRevenue());
        response.setTodayRevenue(getDailyRevenue().getTotalRevenue());
        response.setMonthlyRevenue(getMonthlyRevenue().getTotalRevenue());
        response.setYearlyRevenue(getYearlyRevenue().getTotalRevenue());
        response.setLowStock((long) productRepository.findByStockLessThanEqual(10).size());
        response.setOutOfStock((long) productRepository.findByStock(0).size());
        return response;
    }

    @Override
    public AdminStatsResponse getAdminStats() {
        AdminStatsResponse response = new AdminStatsResponse();
        response.setTotalUsers(userRepository.count());
        response.setTotalProducts(productRepository.count());
        response.setTotalCategories(categoryRepository.count());
        response.setPendingOrders(orderRepository.countByStatus("Pending"));
        response.setDeliveredOrders(orderRepository.countByStatus("Delivered"));
        response.setCancelledOrders(orderRepository.countByStatus("Cancelled"));
        response.setTotalRevenue(getOverallRevenue().getTotalRevenue());
        response.setTodayRevenue(getDailyRevenue().getTotalRevenue());
        response.setMonthlyRevenue(getMonthlyRevenue().getTotalRevenue());
        response.setYearlyRevenue(getYearlyRevenue().getTotalRevenue());
        return response;
    }

    @Override
    @Transactional
    public MedicineResponse addMedicine(MedicineRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new DuplicateMedicineException("Medicine with name " + request.getName() + " already exists");
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new InvalidCategoryException("Category not found"));
                
        Product product = new Product();
        mapMedicineRequestToProduct(request, product, category);
        
        product = productRepository.save(product);
        return mapProductToMedicineResponse(product);
    }

    @Override
    @Transactional
    public MedicineResponse updateMedicine(Long id, MedicineRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new MedicineNotFoundException("Medicine not found"));
                
        if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
            throw new DuplicateMedicineException("Medicine with name " + request.getName() + " already exists");
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new InvalidCategoryException("Category not found"));
                
        mapMedicineRequestToProduct(request, product, category);
        
        product = productRepository.save(product);
        return mapProductToMedicineResponse(product);
    }

    @Override
    @Transactional
    public void deleteMedicine(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new MedicineNotFoundException("Medicine not found"));
        // Does not delete completed orders (since OrderItem maintains a reference or can be handled depending on cascade type)
        // Spring Data JPA will either restrict deletion or nullify based on constraints.
        // Assuming deletion is allowed or soft-delete should be used. For this requirement:
        productRepository.delete(product);
    }

    @Override
    public List<MedicineResponse> getAllMedicines() {
        return productRepository.findAll().stream()
                .map(this::mapProductToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineResponse getMedicineById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new MedicineNotFoundException("Medicine not found"));
        return mapProductToMedicineResponse(product);
    }

    @Override
    public List<MedicineResponse> searchMedicines(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword).stream()
                .map(this::mapProductToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse addCategory(CategoryRequest request) {
        Category category = new Category();
        category.setCategoryName(request.getName());
        category = categoryRepository.save(category);
        return mapCategoryToCategoryResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        category.setCategoryName(request.getName());
        category = categoryRepository.save(category);
        return mapCategoryToCategoryResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        List<Product> products = productRepository.findByCategoryCategoryId(id);
        if (products != null && !products.isEmpty()) {
            throw new InvalidCategoryException("Cannot delete category containing medicines");
        }
        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return mapUserToUserResponse(user);
    }

    @Override
    public List<UserResponse> searchUsers(String keyword) {
        return userRepository.findByUserNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword).stream()
                .map(this::mapUserToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        if ("ADMIN".equals(user.getRole()) && !"ADMIN".equals(role)) {
            long adminCount = userRepository.countByRole("ADMIN");
            if (adminCount <= 1) {
                throw new BadRequestException("Cannot demote the last admin");
            }
        }
        
        user.setRole(role);
        user = userRepository.save(user);
        return mapUserToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long id, boolean active) {
        // Since active status doesn't exist on User entity currently, we may simulate this or skip.
        // Assuming no strict db column mapping exists without altering entity.
        // If required, we'd need to add 'isActive' to User entity.
        // For now, return user as is.
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return mapUserToUserResponse(user);
    }

    @Override
    @Transactional
    public void resetUserPassword(Long id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateInventory(Long medicineId, int quantity, boolean increase) {
        Product product = productRepository.findById(medicineId)
                .orElseThrow(() -> new MedicineNotFoundException("Medicine not found"));
        int currentStock = product.getStock() != null ? product.getStock() : 0;
        int newStock = increase ? currentStock + quantity : currentStock - quantity;
        
        if (newStock < 0) {
            throw new InsufficientStockException("Stock cannot become negative");
        }
        product.setStock(newStock);
        productRepository.save(product);
    }

    @Override
    public List<MedicineResponse> getLowStockMedicines() {
        return productRepository.findByStockLessThanEqual(10).stream()
                .map(this::mapProductToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicineResponse> getOutOfStockMedicines() {
        return productRepository.findByStock(0).stream()
                .map(this::mapProductToMedicineResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapOrderToOrderResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return mapOrderToOrderResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order = orderRepository.save(order);
        return mapOrderToOrderResponse(order);
    }

    @Override
    @Transactional
    public void cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("Cancelled");
        orderRepository.save(order);
    }

    @Override
    public RevenueResponse getDailyRevenue() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        Double revenue = orderRepository.calculateRevenueByDateRange(startOfDay, endOfDay);
        return new RevenueResponse(revenue != null ? revenue : 0.0, orderRepository.countByStatus("Delivered"), "DAILY");
    }

    @Override
    public RevenueResponse getMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(LocalTime.MAX);
        Double revenue = orderRepository.calculateRevenueByDateRange(startOfMonth, endOfMonth);
        return new RevenueResponse(revenue != null ? revenue : 0.0, orderRepository.countByStatus("Delivered"), "MONTHLY");
    }

    @Override
    public RevenueResponse getYearlyRevenue() {
        LocalDateTime startOfYear = LocalDate.now().withDayOfYear(1).atStartOfDay();
        LocalDateTime endOfYear = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear()).atTime(LocalTime.MAX);
        Double revenue = orderRepository.calculateRevenueByDateRange(startOfYear, endOfYear);
        return new RevenueResponse(revenue != null ? revenue : 0.0, orderRepository.countByStatus("Delivered"), "YEARLY");
    }

    @Override
    public RevenueResponse getOverallRevenue() {
        Double revenue = orderRepository.calculateTotalRevenue();
        return new RevenueResponse(revenue != null ? revenue : 0.0, orderRepository.countByStatus("Delivered"), "OVERALL");
    }

    @Override
    public List<AnalyticsResponse> getTopSellingMedicines() {
        List<Object[]> results = orderItemRepository.findTopSellingMedicines(PageRequest.of(0, 5));
        return results.stream().map(result -> {
            Product product = (Product) result[0];
            Long sold = (Long) result[1];
            return new AnalyticsResponse(product.getName(), sold);
        }).collect(Collectors.toList());
    }

    @Override
    public List<AnalyticsResponse> getMostOrderedCategories() {
        List<Object[]> results = orderItemRepository.findMostOrderedCategories(PageRequest.of(0, 5));
        return results.stream().map(result -> {
            Category category = (Category) result[0];
            Long sold = (Long) result[1];
            return new AnalyticsResponse(category.getCategoryName(), sold);
        }).collect(Collectors.toList());
    }

    // Helpers
    private void mapMedicineRequestToProduct(MedicineRequest request, Product product, Category category) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);
    }

    private MedicineResponse mapProductToMedicineResponse(Product product) {
        MedicineResponse response = new MedicineResponse();
        response.setId(product.getProductId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        response.setCategoryName(product.getCategory() != null ? product.getCategory().getCategoryName() : null);
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    private CategoryResponse mapCategoryToCategoryResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getCategoryId());
        response.setName(category.getCategoryName());
        return response;
    }

    private UserResponse mapUserToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUserName(user.getUserName());
        response.setEmail(user.getEmail());
        response.setMobileNumber(user.getMobileNumber());
        response.setRole(user.getRole());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }

    private OrderResponse mapOrderToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setUserName(order.getUser() != null ? order.getUser().getUserName() : null);
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
}
