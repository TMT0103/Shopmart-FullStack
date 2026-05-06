package com.Ecommerce.Backend.service;


import com.Ecommerce.Backend.dto.AuthResponse;
import com.Ecommerce.Backend.entity.Cart;
import com.Ecommerce.Backend.entity.Role;
import com.Ecommerce.Backend.entity.User;
import com.Ecommerce.Backend.respository.CartRepository;
import com.Ecommerce.Backend.respository.UserRepository;
import com.Ecommerce.Backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    public String register (String email,String name, String password){
        if(userRepository.findByEmail(email).isPresent()){
            throw new RuntimeException("Email already exits");
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setRole(Role.USER);
        userRepository.save(user);
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);
        return "User registered successfully";
    }

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Password is incorrect");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);

        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole());
    }
}
