package com.auth.service;

import com.auth.dto.AddToCartRequest;
import com.auth.dto.CartCountResponse;
import com.auth.dto.CartResponse;
import com.auth.dto.UpdateCartRequest;
import com.auth.entity.User;

public interface CartService {
    CartCountResponse addToCart(User user, AddToCartRequest request);
    CartCountResponse getCartCount(User user);
    CartResponse getCartItems(User user);
    CartResponse updateQuantity(User user, UpdateCartRequest request);
    void removeProduct(User user, Long productId);
    void removeProducts(User user, java.util.List<Long> productIds);
    void clearCart(User user);
}
