package com.Ecommerce.Backend.respository;

import com.Ecommerce.Backend.entity.Order;
import com.Ecommerce.Backend.entity.Status;
import com.Ecommerce.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    Order findTopByUserOrderByOrderDateDesc(User user);

    List<Order> findByStatus(Status status);
}
