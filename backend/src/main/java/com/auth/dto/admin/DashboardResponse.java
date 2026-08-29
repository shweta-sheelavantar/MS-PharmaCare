package com.auth.dto.admin;


public class DashboardResponse {
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalMedicines;
    private Long totalCategories;
    private Long totalOrders;
    private Long pendingOrders;
    private Long confirmedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
    private Double totalRevenue;
    private Double todayRevenue;
    private Double monthlyRevenue;
    private Double yearlyRevenue;
    private Long lowStock;
    private Long outOfStock;

    public DashboardResponse() {}

    public DashboardResponse(Long totalUsers, Long totalCustomers, Long totalMedicines, Long totalCategories, Long totalOrders, Long pendingOrders, Long confirmedOrders, Long deliveredOrders, Long cancelledOrders, Double totalRevenue, Double todayRevenue, Double monthlyRevenue, Double yearlyRevenue, Long lowStock, Long outOfStock) {
        this.totalUsers = totalUsers;
        this.totalCustomers = totalCustomers;
        this.totalMedicines = totalMedicines;
        this.totalCategories = totalCategories;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.confirmedOrders = confirmedOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue;
        this.todayRevenue = todayRevenue;
        this.monthlyRevenue = monthlyRevenue;
        this.yearlyRevenue = yearlyRevenue;
        this.lowStock = lowStock;
        this.outOfStock = outOfStock;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getTotalMedicines() {
        return totalMedicines;
    }

    public void setTotalMedicines(Long totalMedicines) {
        this.totalMedicines = totalMedicines;
    }

    public Long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(Long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getConfirmedOrders() {
        return confirmedOrders;
    }

    public void setConfirmedOrders(Long confirmedOrders) {
        this.confirmedOrders = confirmedOrders;
    }

    public Long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(Long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(Double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public Double getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(Double monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public Double getYearlyRevenue() {
        return yearlyRevenue;
    }

    public void setYearlyRevenue(Double yearlyRevenue) {
        this.yearlyRevenue = yearlyRevenue;
    }

    public Long getLowStock() {
        return lowStock;
    }

    public void setLowStock(Long lowStock) {
        this.lowStock = lowStock;
    }

    public Long getOutOfStock() {
        return outOfStock;
    }

    public void setOutOfStock(Long outOfStock) {
        this.outOfStock = outOfStock;
    }
}
