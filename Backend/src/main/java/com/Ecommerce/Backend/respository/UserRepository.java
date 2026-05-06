package com.Ecommerce.Backend.respository;


import com.Ecommerce.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Tìm theo tên
    List<User> findByName(String name);

    // Tìm theo email (dùng cho login)
    Optional<User> findByEmail(String email);

    // Tìm theo domain email (vd: gmail.com)
    @Query("SELECT u FROM User u WHERE u.email LIKE %:domain")
    List<User> findUsersByEmailDomain(@Param("domain") String domain);
}
