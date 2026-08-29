package com.auth.dto;

public class CartCountResponse {
    private int count;

    public CartCountResponse(int count) { this.count = count; }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
