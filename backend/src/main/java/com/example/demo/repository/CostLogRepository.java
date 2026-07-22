package com.example.demo.repository;

import com.example.demo.entity.CostLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CostLogRepository extends JpaRepository<CostLog, Long> {

    /**
     * Tính tổng toàn bộ chi phí từ bảng cost_logs.
     * Sử dụng COALESCE để trả về 0.0 nếu bảng đang trống (tránh lỗi NullPointerException).
     */
    @Query("SELECT COALESCE(SUM(c.cost), 0.0) FROM CostLog c")
    Double getTotalCost();
}