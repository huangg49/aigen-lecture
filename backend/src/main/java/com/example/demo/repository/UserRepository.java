package com.example.demo.repository;

import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndUserIdNot(String email, Integer userId);

    java.util.Optional<User> findByEmail(String email);

    long countByRole(UserRole role);

    Optional<User> findByResetToken(String resetToken);

    @Query(value = "SELECT TO_CHAR(created_at, 'FMMM') AS month, " +
                   "SUM(CASE WHEN role = 'STUDENT' THEN 1 ELSE 0 END) AS students, " +
                   "SUM(CASE WHEN role = 'TEACHER' THEN 1 ELSE 0 END) AS teachers " +
                   "FROM users " + // Lưu ý: đổi thành tên bảng user của bạn nếu nó khác 'users'
                   "WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                   "GROUP BY EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'FMMM') " +
                   "ORDER BY EXTRACT(MONTH FROM created_at)", nativeQuery = true)
    List<Object[]> getUserGrowth();
}
