package com.Ecommerce.Backend.dto;

import com.Ecommerce.Backend.entity.Role;
import lombok.Getter;

@Getter
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private Role role;

    public AuthResponse(String token, String email, String name, Role role) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
    }

}

