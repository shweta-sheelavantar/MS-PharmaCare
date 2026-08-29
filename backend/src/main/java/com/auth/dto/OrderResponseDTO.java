package com.auth.dto;
import java.util.List;
public class OrderResponseDTO {
    private String role;
    private String username;
    private List<OrderDTO> orders;
    public OrderResponseDTO() {}
    public OrderResponseDTO(String role, String username, List<OrderDTO> orders) {
        this.role = role; this.username = username; this.orders = orders;
    }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public List<OrderDTO> getOrders() { return orders; }
    public void setOrders(List<OrderDTO> orders) { this.orders = orders; }
}
