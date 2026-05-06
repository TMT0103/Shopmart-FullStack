package com.Ecommerce.Backend.service;

import com.Ecommerce.Backend.entity.Cart;
import com.Ecommerce.Backend.entity.CartItem;
import com.Ecommerce.Backend.entity.Product;
import com.Ecommerce.Backend.entity.User;
import com.Ecommerce.Backend.respository.CartItemRepository;
import com.Ecommerce.Backend.respository.CartRepository;
import com.Ecommerce.Backend.respository.ProductRepository;
import com.Ecommerce.Backend.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    //  Lấy cart
    public Cart getOrCreateCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    //  ADD ITEM
    public void addItem(String email, Long productId, int quantity) {
        Cart cart = getOrCreateCart(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);

            // 🔥 THÊM DÒNG NÀY
            cart.getItems().add(item);

        } else {
            item.setQuantity(item.getQuantity() + quantity);
        }

        cartRepository.save(cart); // 🔥 save cart thay vì item
    }

    //  REMOVE ITEM
    public void removeItem(String email, Long productId) {
        Cart cart = getOrCreateCart(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
    }

    //  UPDATE QUANTITY
    public void updateQuantity(String email, Long productId, int quantity) {
        Cart cart = getOrCreateCart(email);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }

    // GET CART
    public List<CartItem> getCartItems(String email) {
        Cart cart = getOrCreateCart(email);
        return cartItemRepository.findByCart(cart);
    }
}
