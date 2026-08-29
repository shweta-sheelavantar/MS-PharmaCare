package com.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CartItemResponse {
    @JsonProperty("cart_item_id")
    private Long cartItemId;
    @JsonProperty("product_id")
    private Long productId;
    private String name;
    private String description;
    @JsonProperty("image_url")
    private String imageUrl;
    @JsonProperty("price_per_unit")
    private Double pricePerUnit;
    private int quantity;
    @JsonProperty("total_price")
    private Double totalPrice;
    private Integer stock;
    private CategoryDTO category;

    public CartItemResponse() {}

    public Long getCartItemId() { return cartItemId; }
    public void setCartItemId(Long cartItemId) { this.cartItemId = cartItemId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Double getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(Double pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }
}
