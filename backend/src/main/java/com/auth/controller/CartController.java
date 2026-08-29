package com.auth.controller;

import com.auth.dto.*;
import com.auth.entity.User;
import com.auth.exception.UnauthorizedException;
import com.auth.security.UserPrincipal;
import com.auth.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private User getAuthenticatedCustomer() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserPrincipal) {
            User user = ((UserPrincipal) principal).getUser();
            if (!"CUSTOMER".equalsIgnoreCase(user.getRole())) {
                throw new UnauthorizedException("Only customers can access the cart");
            }
            return user;
        }
        throw new UnauthorizedException("User is not authenticated");
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartCountResponse>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        User user = getAuthenticatedCustomer();
        CartCountResponse response = cartService.addToCart(user, request);
        return ResponseEntity.ok(ApiResponse.success("Product added to cart", response));
    }

    @GetMapping("/items/count")
    public ResponseEntity<ApiResponse<CartCountResponse>> getCartCount() {
        User user = getAuthenticatedCustomer();
        CartCountResponse response = cartService.getCartCount(user);
        return ResponseEntity.ok(ApiResponse.success("Cart count retrieved successfully", response));
    }

    @GetMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> getCartItems() {
        User user = getAuthenticatedCustomer();
        CartResponse response = cartService.getCartItems(user);
        return ResponseEntity.ok(ApiResponse.success("Cart items retrieved successfully", response));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(@Valid @RequestBody UpdateCartRequest request) {
        User user = getAuthenticatedCustomer();
        CartResponse response = cartService.updateQuantity(user, request);
        return ResponseEntity.ok(ApiResponse.success("Cart updated successfully", response));
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> removeProduct(@PathVariable Long productId) {
        User user = getAuthenticatedCustomer();
        cartService.removeProduct(user, productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed successfully.", Map.of("message", "Product removed successfully.")));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Map<String, String>>> clearCart() {
        User user = getAuthenticatedCustomer();
        cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully.", Map.of("message", "Cart cleared successfully.")));
    }
}
