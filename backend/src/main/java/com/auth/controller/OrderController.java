package com.auth.controller;

import com.auth.dto.OrderRequest;
import com.auth.dto.OrderItemRequest;
import com.auth.dto.OrderResponseDTO;
import com.auth.dto.OrderDTO;
import com.auth.dto.OrderProductDTO;
import com.auth.entity.Order;
import com.auth.entity.OrderItem;
import com.auth.entity.Product;
import com.auth.entity.User;
import com.auth.repository.OrderItemRepository;
import com.auth.repository.OrderRepository;
import com.auth.repository.ProductRepository;
import com.auth.repository.UserRepository;
import com.auth.repository.PaymentRepository;
import com.auth.service.CartService;
import com.auth.service.EmailService;
import com.auth.service.InvoiceService;
import com.auth.entity.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.springframework.transaction.annotation.Transactional;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")

public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private InvoiceService invoiceService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @GetMapping
    @Transactional
    public ResponseEntity<OrderResponseDTO> getUserOrders() {
        return fetchUserOrders();
    }

    @GetMapping("/user")
    @Transactional
    public ResponseEntity<OrderResponseDTO> getUserOrdersAlias() {
        return fetchUserOrders();
    }

    private ResponseEntity<OrderResponseDTO> fetchUserOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(user);
        
        List<OrderDTO> orderDTOs = orders.stream().map(this::mapToOrderDTO).collect(Collectors.toList());

        OrderResponseDTO response = new OrderResponseDTO();
        response.setRole(user.getRole() != null ? user.getRole() : "CUSTOMER");
        response.setUsername(user.getUserName());
        response.setOrders(orderDTOs);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    @Transactional
    public ResponseEntity<?> getOrderById(@PathVariable String orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Order not found"));
        }
        
        if (user == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        
        return ResponseEntity.ok(mapToOrderDTO(order));
    }

    @PutMapping("/{orderId}/cancel")
    @Transactional
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId, @RequestBody(required = false) Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Order not found"));
        }
        
        if (user == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        
        String currentStatus = order.getStatus().toUpperCase();
        if ("PENDING".equals(currentStatus) || "CONFIRMED".equals(currentStatus) || "PROCESSING".equals(currentStatus)) {
            order.setStatus("CANCELLED");
            if (body != null && body.containsKey("reason")) {
                order.setCancelReason(body.get("reason"));
            }
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
        } else {
            return ResponseEntity.status(400).body(Map.of("message", "Order cannot be cancelled at this stage"));
        }
    }

    @PostMapping("/{orderId}/items/{itemId}/refund")
    @Transactional
    public ResponseEntity<?> refundOrderItem(@PathVariable String orderId, @PathVariable Long itemId, @RequestBody(required = false) Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Order not found"));
        }
        
        if (user == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        
        if (!"DELIVERED".equalsIgnoreCase(order.getStatus())) {
            return ResponseEntity.status(400).body(Map.of("message", "Refunds can only be requested for delivered orders"));
        }
        
        OrderItem targetItem = null;
        for (OrderItem item : order.getItems()) {
            if (item.getId().equals(itemId)) {
                targetItem = item;
                break;
            }
        }
        
        if (targetItem == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Order item not found"));
        }
        
        if (targetItem.getStatus() != null && targetItem.getStatus().contains("REFUND")) {
            return ResponseEntity.status(400).body(Map.of("message", "Refund already requested for this item"));
        }
        
        targetItem.setStatus("REFUND_REQUESTED");
        if (body != null && body.containsKey("reason")) {
            targetItem.setRefundReason(body.get("reason"));
        }
        orderItemRepository.save(targetItem);
        
        return ResponseEntity.ok(Map.of("message", "Refund requested successfully"));
    }

    @GetMapping("/invoice/{orderId}")
    @Transactional
    public ResponseEntity<?> downloadInvoice(@PathVariable String orderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Order not found"));
        }
        
        if (user == null || !order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }
        
        byte[] pdfBytes = invoiceService.generateInvoice(order);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "invoice_" + orderId + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return new ResponseEntity<>(pdfBytes, headers, 200);
    }

    private OrderDTO mapToOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setPaymentId(order.getRazorpayPaymentId());
        dto.setOrderDate(order.getCreatedAt());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setOrderStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setDiscount(order.getDiscount());
        dto.setGst(order.getGst());
        dto.setDeliveryCharge(order.getDeliveryCharge());
        dto.setPlatformFee(order.getPlatformFee());
        dto.setDeliveryAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setCancelReason(order.getCancelReason());

        List<OrderProductDTO> productDTOs = new ArrayList<>();
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                OrderProductDTO pDto = new OrderProductDTO();
                Product product = item.getProduct();
                if (product != null) {
                    pDto.setProductId(product.getProductId());
                    pDto.setName(product.getName());
                    pDto.setDescription(product.getDescription());
                    pDto.setCategory(product.getCategory() != null ? product.getCategory().getCategoryName() : null);
                    pDto.setQuantity(item.getQuantity());
                    pDto.setPricePerUnit(item.getPricePerUnit());
                    pDto.setTotalPrice(item.getTotalPrice());
                    pDto.setOrderItemId(item.getId());
                    pDto.setItemStatus(item.getStatus());
                    pDto.setRefundReason(item.getRefundReason());
                    if (product.getImages() != null && !product.getImages().isEmpty()) {
                        pDto.setImageUrl(product.getImages().get(0).getImageUrl());
                    }
                }
                productDTOs.add(pDto);
            }
        }
        dto.setProducts(productDTOs);
        return dto;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setOrderId("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setDiscount(orderRequest.getDiscount() != null ? orderRequest.getDiscount() : 0.0);
        order.setGst(orderRequest.getGst() != null ? orderRequest.getGst() : 0.0);
        order.setDeliveryCharge(orderRequest.getDeliveryCharge() != null ? orderRequest.getDeliveryCharge() : 0.0);
        order.setPlatformFee(orderRequest.getPlatformFee() != null ? orderRequest.getPlatformFee() : 0.0);
        order.setStatus("PENDING");
        order.setPaymentStatus("PENDING");
        order.setShippingAddress(orderRequest.getShippingAddress() != null ? orderRequest.getShippingAddress() : "123 Default Street");
        order.setPaymentMethod(orderRequest.getPaymentMethod() != null ? orderRequest.getPaymentMethod() : "CARD");

        if (orderRequest.getItems() != null) {
            for (OrderItemRequest itemReq : orderRequest.getItems()) {
                if (itemReq.getProductId() == null) {
                    return ResponseEntity.status(400).body(Map.of("message", "Product ID cannot be null"));
                }
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found for ID: " + itemReq.getProductId()));
                if (product.getStock() < itemReq.getQuantity()) {
                    return ResponseEntity.status(400).body(Map.of("message", "Insufficient stock for product: " + product.getName()));
                }
            }
        }
        
        if ("RAZORPAY".equalsIgnoreCase(order.getPaymentMethod())) {
            try {
                RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderReq = new JSONObject();
                orderReq.put("amount", (int)(order.getTotalAmount() * 100));
                orderReq.put("currency", "INR");
                orderReq.put("receipt", order.getOrderId());
                com.razorpay.Order razorpayOrder = razorpay.orders.create(orderReq);
                order.setRazorpayOrderId(razorpayOrder.get("id"));
            } catch (Exception e) {
                // Mock order ID for student project demo if keys are missing/invalid
                order.setRazorpayOrderId("order_mock_" + System.currentTimeMillis());
            }
        }

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> savedItems = new ArrayList<>();
        if (orderRequest.getItems() != null) {
            for (OrderItemRequest itemReq : orderRequest.getItems()) {
                Product product = productRepository.findById(itemReq.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(savedOrder);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemReq.getQuantity());
                orderItem.setPricePerUnit(itemReq.getPrice());
                orderItem.setTotalPrice(itemReq.getPrice() * itemReq.getQuantity());
                
                savedItems.add(orderItemRepository.save(orderItem));
            }
        }
        
        if (!"RAZORPAY".equalsIgnoreCase(order.getPaymentMethod())) {
            savedOrder.setStatus("CONFIRMED");
            orderRepository.save(savedOrder);
            
            // For COD, update stock and clear cart immediately
            if (orderRequest.getItems() != null) {
                for (OrderItemRequest itemReq : orderRequest.getItems()) {
                    Product product = productRepository.findById(itemReq.getProductId()).orElse(null);
                    if (product != null && product.getStock() >= itemReq.getQuantity()) {
                        product.setStock(product.getStock() - itemReq.getQuantity());
                        productRepository.save(product);
                        cartService.removeProducts(user, List.of(product.getProductId()));
                    }
                }
            }
        }

        return ResponseEntity.ok(savedOrder);
    }

    @PostMapping("/verify-payment")
    @Transactional
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        String razorpayOrderId = data.get("razorpayOrderId");
        String razorpayPaymentId = data.get("razorpayPaymentId");
        String razorpaySignature = data.get("razorpaySignature");
        String localOrderId = data.get("orderId");

        System.out.println("=== PAYMENT VERIFICATION START ===");
        System.out.println("Local Order ID: " + localOrderId);
        System.out.println("Razorpay Order ID: " + razorpayOrderId);
        System.out.println("Razorpay Payment ID: " + razorpayPaymentId);
        System.out.println("Razorpay Signature present: " + (razorpaySignature != null && !razorpaySignature.isEmpty()));
        System.out.println("Razorpay Key Secret length: " + (razorpayKeySecret != null ? razorpayKeySecret.length() : "NULL"));

        try {
            // Build the payload string that Razorpay SDK will hash
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            System.out.println("Signature payload: " + payload);

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);
            
            boolean isValid = false;
            if (razorpayOrderId.startsWith("order_mock_") || "mock_signature".equals(razorpaySignature)) {
                isValid = true;
                System.out.println("Signature validation bypassed for mock order.");
            } else {
                try {
                    isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
                    System.out.println("Signature verification result: " + isValid);
                } catch (RazorpayException e) {
                    System.out.println("Razorpay signature verification EXCEPTION: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            if (isValid) {
                System.out.println("Signature VALID. Looking up order: " + localOrderId);
                Order order = orderRepository.findById(localOrderId).orElse(null);
                if (order != null) {
                    System.out.println("Order found. Stored razorpayOrderId: " + order.getRazorpayOrderId());
                    order.setStatus("CONFIRMED");
                    order.setPaymentStatus("PAID");
                    order.setRazorpayPaymentId(razorpayPaymentId);
                    orderRepository.save(order);

                    Payment payment = new Payment();
                    payment.setUser(order.getUser());
                    payment.setRazorpayPaymentId(razorpayPaymentId);
                    payment.setRazorpayOrderId(razorpayOrderId);
                    payment.setAmount(order.getTotalAmount());
                    payment.setPaymentMethod("RAZORPAY");
                    payment.setPaymentStatus("SUCCESS");
                    payment.setSignature(razorpaySignature);
                    paymentRepository.save(payment);

                    // Update stock and clear cart items for successful payment
                    for (OrderItem item : order.getItems()) {
                        Product product = item.getProduct();
                        if (product != null && product.getProductId() != null) {
                            if (product.getStock() >= item.getQuantity()) {
                                product.setStock(product.getStock() - item.getQuantity());
                                productRepository.save(product);
                            }
                            cartService.removeProducts(order.getUser(), List.of(product.getProductId()));
                        }
                    }
                    
                    try {
                        emailService.sendOrderConfirmationEmail(order.getUser().getEmail(), order.getOrderId(), order.getTotalAmount().toString());
                    } catch (Exception e) {
                        System.err.println("Failed to send email: " + e.getMessage());
                    }

                    System.out.println("=== PAYMENT VERIFICATION SUCCESS ===");
                    return ResponseEntity.ok(Map.of("message", "Payment verified successfully", "orderId", order.getOrderId(), "status", "PAID"));
                }
                System.out.println("Order NOT FOUND for ID: " + localOrderId);
                return ResponseEntity.status(404).body(Map.of("message", "Order not found"));
            } else {
                System.out.println("=== SIGNATURE INVALID ===");
                return ResponseEntity.status(400).body(Map.of("message", "Invalid payment signature"));
            }
        } catch (Exception e) {
            System.out.println("=== PAYMENT VERIFICATION EXCEPTION ===");
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error verifying payment: " + e.getMessage()));
        }
    }
}
