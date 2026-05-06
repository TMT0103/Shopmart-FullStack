package com.Ecommerce.Backend.dto;

import com.Ecommerce.Backend.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @Setter
    private String email;
    @Setter
    private String password;

    private Role role;


}
