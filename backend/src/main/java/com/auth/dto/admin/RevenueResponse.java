package com.auth.dto.admin;


public class RevenueResponse {
    private Double totalRevenue;
    private Long orderCount;
    private String period; // e.g., "DAILY", "MONTHLY", "YEARLY", "OVERALL"

    public RevenueResponse() {}

    public RevenueResponse(Double totalRevenue, Long orderCount, String period) {
        this.totalRevenue = totalRevenue;
        this.orderCount = orderCount;
        this.period = period;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
