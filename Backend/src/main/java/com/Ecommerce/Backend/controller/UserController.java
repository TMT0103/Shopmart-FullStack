package com.Ecommerce.Backend.controller;

import com.Ecommerce.Backend.dto.UpdateUserRequest;
import com.Ecommerce.Backend.entity.User;
import com.Ecommerce.Backend.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    @PutMapping("/me")
    public User updateCurrentUser(Authentication authentication,
                                  @RequestBody UpdateUserRequest req) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());
        user.setCity(req.getCity());


        return userRepository.save(user);
    }
    @GetMapping
    public List<User> getAllUser() {
        return userRepository.findAll();
    }
}
