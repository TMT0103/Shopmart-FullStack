package com.Ecommerce.Backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.annotation.processing.Generated;

@Getter
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(nullable = false,unique = true)
    private String name;

    public void setCategoryId(Long id) {
        this.id = id;
    }

}
