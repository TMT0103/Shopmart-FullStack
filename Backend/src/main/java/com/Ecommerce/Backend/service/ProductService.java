package com.Ecommerce.Backend.service;

import com.Ecommerce.Backend.entity.Product;
import com.Ecommerce.Backend.respository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    public  List<Product> getProductByCategory(Long categoryId){
        return  productRepository.findByCategoryId(categoryId);
    }
}
