package com.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WishlistItemResponse {
    @JsonProperty("wishlist_id")
    private Long wishlistId;
    @JsonProperty("product_id")
    private Long productId;
    private String name;
    private String description;
    @JsonProperty("image_url")
    private String imageUrl;
    private Double price;
    private Integer stock;
    private CategoryDTO category;

    public WishlistItemResponse() {}

    @JsonProperty("wishlist_id")
    public Long getWishlistId() { return wishlistId; }
    public void setWishlistId(Long wishlistId) { this.wishlistId = wishlistId; }
    
    @JsonProperty("product_id")
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    @JsonProperty("image_url")
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public CategoryDTO getCategory() { return category; }
    public void setCategory(CategoryDTO category) { this.category = category; }
}
