package com.Ecommerce.Backend.respository;

import com.Ecommerce.Backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    // 1. Tìm tất cả sản phẩm theo tên (chứa từ khóa, không phân biệt hoa thường)
    List<Product> findByNameContainingIgnoreCase(String name);
    // 2. Tìm sản phẩm theo danh mục (Category)
    // Spring Data JPA rất thông minh, nó sẽ tự hiểu bạn muốn lọc theo CategoryId
    List<Product> findByCategoryId(Long categoryId);

    // 3. Tìm sản phẩm có giá trong khoảng từ min đến max
    List<Product> findByPriceBetween(float minPrice, float maxPrice);

    // 4. Tìm các sản phẩm còn hàng (stock > 0)
    List<Product> findByStockGreaterThan(int quantity);


}
