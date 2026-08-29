package com.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AddToWishlistRequest {
    @JsonProperty("product_id")
    private Long productId;

    public AddToWishlistRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}
