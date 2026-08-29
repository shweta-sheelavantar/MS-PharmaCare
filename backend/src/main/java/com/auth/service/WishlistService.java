package com.auth.service;

import com.auth.dto.AddToWishlistRequest;
import com.auth.dto.WishlistResponse;
import com.auth.entity.User;

public interface WishlistService {
    WishlistResponse getWishlistItems(User user);
    void addToWishlist(User user, AddToWishlistRequest request);
    void removeFromWishlist(User user, Long productId);
}
