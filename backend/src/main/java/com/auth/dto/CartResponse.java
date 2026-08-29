package com.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CartResponse {
    private String role;
    private String username;
    private CartDetails cart;

    public CartResponse() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public CartDetails getCart() { return cart; }
    public void setCart(CartDetails cart) { this.cart = cart; }

    public static class CartDetails {
        @JsonProperty("overall_total_price")
        private Double overallTotalPrice;
        private List<CartItemResponse> products;

        public CartDetails() {}

        public Double getOverallTotalPrice() { return overallTotalPrice; }
        public void setOverallTotalPrice(Double overallTotalPrice) { this.overallTotalPrice = overallTotalPrice; }
        public List<CartItemResponse> getProducts() { return products; }
        public void setProducts(List<CartItemResponse> products) { this.products = products; }
    }
}
