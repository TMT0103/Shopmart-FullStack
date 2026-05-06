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
@Entity
@Table (name = "products")
public class Product {
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(nullable = false)
    private String name;

    @Getter
    @Setter
    @Column(nullable = false)
    private float price;

    @Getter
    @Setter
    @Column(nullable = false)
    private int stock;

    @Column(columnDefinition = "TEXT")
    private String description;
    @Getter
    @Setter
    @Column
    private String imageUrl;

    @Getter
    @Setter
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;


}
