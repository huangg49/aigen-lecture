package com.example.demo.repository;

import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndUserIdNot(String email, Integer userId);

    java.util.Optional<User> findByEmail(String email);

    long countByRole(UserRole role);

    Optional<User> findByResetToken(String resetToken);
}
