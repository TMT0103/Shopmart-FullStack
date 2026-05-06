package com.Ecommerce.Backend.controller;

import com.Ecommerce.Backend.entity.Product;
import com.Ecommerce.Backend.respository.ProductRepository;
import com.Ecommerce.Backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;
    private final ProductService productService;
    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return productRepository.findByCategoryId(categoryId);
        }
        return productRepository.findAll();
    }
    @GetMapping("/search")
    public List<Product> search(@RequestParam String keyword) {
        return productService.searchProducts(keyword);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        System.out.println("Product nhận được: " + product.getName());
        System.out.println("Category: " + product.getCategory());
        return productRepository.save(product);
    }
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updateProduct){
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(updateProduct.getName());
        existing.setStock(updateProduct.getStock());
        existing.setPrice(updateProduct.getPrice());
        existing.setImageUrl(updateProduct.getImageUrl());
        if (updateProduct.getCategory() != null) {
            existing.setCategory(updateProduct.getCategory());
        }
        return productRepository.save(existing);
    }
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
    }

}
