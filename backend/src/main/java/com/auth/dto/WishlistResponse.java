package com.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class WishlistResponse {
    private List<WishlistItemResponse> items;
    @JsonProperty("total_items")
    private int totalItems;

    public WishlistResponse() {}

    public List<WishlistItemResponse> getItems() { return items; }
    public void setItems(List<WishlistItemResponse> items) { this.items = items; }
    public int getTotalItems() { return totalItems; }
    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }
}
