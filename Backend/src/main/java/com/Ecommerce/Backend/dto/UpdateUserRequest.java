package com.Ecommerce.Backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    private String name;
    private String phone;
    private String address;
    private String city;

}
