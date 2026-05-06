package com.Ecommerce.Backend.controller;

import com.Ecommerce.Backend.entity.CartItem;
import com.Ecommerce.Backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 🛒 ADD
    @PostMapping("/add")
    public String addItem(@RequestParam Long productId,
                          @RequestParam int quantity,
                          Authentication authentication) {

        String email = authentication.getName();
        cartService.addItem(email, productId, quantity);

        return "Added to cart";
    }

    // ❌ REMOVE
    @DeleteMapping("/remove")
    public String removeItem(@RequestParam Long productId,
                             Authentication authentication) {

        String email = authentication.getName();
        cartService.removeItem(email, productId);

        return "Removed from cart";
    }

    // 🔄 UPDATE
    @PutMapping("/update")
    public String updateQuantity(@RequestParam Long productId,
                                 @RequestParam int quantity,
                                 Authentication authentication) {

        String email = authentication.getName();
        cartService.updateQuantity(email, productId, quantity);

        return "Updated cart";
    }

    // 📦 VIEW CART
    @GetMapping
    public List<CartItem> getCart(Authentication authentication) {

        String email = authentication.getName();
        return cartService.getCartItems(email);
    }
}
