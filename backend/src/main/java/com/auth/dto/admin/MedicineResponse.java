package com.auth.dto.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class MedicineResponse {
    private Long id;
    private String name;
    private String description;
    private String manufacturer;
    private String brand;
    private Double price;
    private Double discount;
    private Double finalPrice;
    private Integer stock;
    private LocalDate expiryDate;
    private Boolean prescriptionRequired;
    private String categoryName;
    private Long categoryId;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MedicineResponse() {}

    public MedicineResponse(Long id, String name, String description, String manufacturer, String brand, Double price, Double discount, Double finalPrice, Integer stock, LocalDate expiryDate, Boolean prescriptionRequired, String categoryName, Long categoryId, List<String> images, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.manufacturer = manufacturer;
        this.brand = brand;
        this.price = price;
        this.discount = discount;
        this.finalPrice = finalPrice;
        this.stock = stock;
        this.expiryDate = expiryDate;
        this.prescriptionRequired = prescriptionRequired;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.images = images;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Boolean getPrescriptionRequired() {
        return prescriptionRequired;
    }

    public void setPrescriptionRequired(Boolean prescriptionRequired) {
        this.prescriptionRequired = prescriptionRequired;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
