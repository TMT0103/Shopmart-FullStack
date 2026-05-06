package com.Ecommerce.Backend.controller;

import com.Ecommerce.Backend.dto.AuthResponse;
import com.Ecommerce.Backend.dto.LoginRequest;
import com.Ecommerce.Backend.dto.RegisterRequest;
import com.Ecommerce.Backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/auth", produces = {"application/json"})
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.register(
                request.getEmail(),
                request.getName(),
                request.getPassword()
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(
                request.getEmail(),
                request.getPassword()

        );
    }
}
