package com.auth.service;

import com.auth.dto.AddToWishlistRequest;
import com.auth.dto.WishlistItemResponse;
import com.auth.dto.WishlistResponse;
import com.auth.entity.Product;
import com.auth.entity.User;
import com.auth.entity.Wishlist;
import com.auth.repository.ProductRepository;
import com.auth.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private WishlistMapper wishlistMapper;

    @Override
    public WishlistResponse getWishlistItems(User user) {
        List<Wishlist> wishlists = wishlistRepository.findByUser(user);
        List<WishlistItemResponse> itemResponses = wishlists.stream()
                .map(wishlistMapper::toDto)
                .collect(Collectors.toList());

        WishlistResponse response = new WishlistResponse();
        response.setItems(itemResponses);
        response.setTotalItems(itemResponses.size());
        return response;
    }

    @Override
    public void addToWishlist(User user, AddToWishlistRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!wishlistRepository.existsByUserAndProduct(user, product)) {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
        }
    }

    @Override
    public void removeFromWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlistRepository.deleteByUserAndProduct(user, product);
    }
}
