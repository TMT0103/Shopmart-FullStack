package com.Ecommerce.Backend.controller;

import com.Ecommerce.Backend.dto.CheckoutRequest;
import com.Ecommerce.Backend.entity.Order;
import com.Ecommerce.Backend.entity.User;
import com.Ecommerce.Backend.respository.OrderRepository;
import com.Ecommerce.Backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.Ecommerce.Backend.respository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    @PostMapping("/checkout")
    public Order checkout(@AuthenticationPrincipal UserDetails userDetails) {

        // 🔥 lấy email từ JWT
        String email = userDetails.getUsername();

        // 🔥 gọi đúng cách (KHÔNG static)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderService.checkout(user);
    }
    @GetMapping("/my-orders")
    public List<Order> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
    @GetMapping
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }
    @GetMapping("/{id}")
    public Order getOrderDetail(@PathVariable Long id, Authentication auth) {
        String email = auth.getName();

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 🔥 chỉ cho user xem đơn của chính họ
        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Access denied");
        }

        return order;
    }
    @PutMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return orderService.updateStatus(id, status);
    }
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}