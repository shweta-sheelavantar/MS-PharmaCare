package com.auth.service;

import com.auth.dto.CartItemResponse;
import com.auth.entity.CartItem;
import com.auth.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class CartMapper {

    public CartItemResponse toDto(CartItem item) {
        CartItemResponse response = new CartItemResponse();
        Product product = item.getProduct();
        response.setCartItemId(item.getId());
        response.setProductId(product.getProductId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            response.setImageUrl(product.getImages().get(0).getImageUrl());
        }
        
        response.setPricePerUnit(product.getPrice());
        response.setQuantity(item.getQuantity());
        response.setTotalPrice(product.getPrice() * item.getQuantity());
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
