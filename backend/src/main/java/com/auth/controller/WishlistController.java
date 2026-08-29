package com.auth.controller;

import com.auth.dto.AddToWishlistRequest;
import com.auth.dto.ApiResponse;
import com.auth.dto.WishlistResponse;
import com.auth.entity.User;
import com.auth.repository.UserRepository;
import com.auth.security.UserPrincipal;
import com.auth.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            return userRepository.findById(userPrincipal.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping("/items")
    public ResponseEntity<WishlistResponse> getWishlistItems() {
        User user = getAuthenticatedCustomer();
        WishlistResponse response = wishlistService.getWishlistItems(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToWishlist(@RequestBody AddToWishlistRequest request) {
        User user = getAuthenticatedCustomer();
        wishlistService.addToWishlist(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Item added to wishlist successfully", null));
    }

    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<ApiResponse> removeFromWishlist(@PathVariable Long productId) {
        User user = getAuthenticatedCustomer();
        wishlistService.removeFromWishlist(user, productId);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from wishlist successfully", null));
    }
}
