package com.Ecommerce.Backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CheckoutRequest {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String paymentMethod;
    private double total;
    private List<CheckoutItem> items;

    @Getter
    @Setter
    public static class CheckoutItem {
        private Long productId;
        private int quantity;
        private double price;
    }
}
