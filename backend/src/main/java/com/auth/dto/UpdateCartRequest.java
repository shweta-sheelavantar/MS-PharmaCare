package com.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateCartRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Operation is required")
    private String operation;

    public UpdateCartRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
}
