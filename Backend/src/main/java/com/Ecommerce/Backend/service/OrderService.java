package com.Ecommerce.Backend.service;

import com.Ecommerce.Backend.entity.*;
import com.Ecommerce.Backend.respository.CartRepository;
import com.Ecommerce.Backend.respository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Order checkout(User user) {

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Status.PROCESSING);

        List<OrderItem> orderItems = new ArrayList<>();

        double total = 0;
        int totalItems = 0;

        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }

            product.setStock(product.getStock() - cartItem.getQuantity());

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(product.getPrice());
            item.setOrder(order);

            total += item.getPrice() * item.getQuantity();
            totalItems += item.getQuantity();

            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotal(total);
        order.setTotalItems(totalItems);

        Order savedOrder = orderRepository.save(order);

        // clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }
    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUserId(user.getId());
    }
    public Order getOrderDetail(Long orderId, String email) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        return order;
    }
    public Order updateStatus(Long orderId, String status){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Status newStatus = Status.valueOf(status.toUpperCase());

        order.setStatus(newStatus);

        return orderRepository.save(order);
    }
}
