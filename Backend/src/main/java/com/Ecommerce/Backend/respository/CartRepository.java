package com.Ecommerce.Backend.respository;

import com.Ecommerce.Backend.entity.Cart;
import com.Ecommerce.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);



}
