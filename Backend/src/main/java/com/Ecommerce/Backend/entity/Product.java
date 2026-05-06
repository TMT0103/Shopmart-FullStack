package com.Ecommerce.Backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

//Product
//        id
//name
//        price
//stock
//        description
//category_id
@Setter
@Getter
@Entity
@Table (name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private float price;

    @Column(nullable = false)
    private int stock;

    @Column(columnDefinition = "TEXT")
    private String description;
    @Column
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;


}
