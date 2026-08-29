package com.auth.service;

import com.auth.dto.WishlistItemResponse;
import com.auth.entity.Product;
import com.auth.entity.Wishlist;
import org.springframework.stereotype.Component;

@Component
public class WishlistMapper {
    public WishlistItemResponse toDto(Wishlist wishlist) {
        WishlistItemResponse response = new WishlistItemResponse();
        Product product = wishlist.getProduct();
        response.setWishlistId(wishlist.getWishlistId());
        response.setProductId(product.getProductId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImageUrl(product.getImages().get(0).getImageUrl());
        }
        
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        
        if (product.getCategory() != null) {
            response.setCategory(new com.auth.dto.CategoryDTO(
                    product.getCategory().getCategoryId(),
                    product.getCategory().getCategoryName(),
                    "",
                    "",
                    "",
                    0
            ));
        }
        return response;
    }
}
