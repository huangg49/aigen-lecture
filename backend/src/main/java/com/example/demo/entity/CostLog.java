package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cost_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CostLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cột lưu chi phí của mỗi lần gọi API LLM (chính là c.cost mà ta dùng trong Repository)
    @Column(name = "cost", nullable = false)
    private Double cost;

    // Tên model đã sử dụng (Ví dụ: "gpt-3.5-turbo", "gemini-pro")
    @Column(name = "model", length = 100)
    private String model;

    // Lưu lại số lượng token đầu vào
    @Column(name = "prompt_tokens")
    private Integer promptTokens;

    // Lưu lại số lượng token đầu ra (do AI sinh ra)
    @Column(name = "completion_tokens")
    private Integer completionTokens;

    // Thời gian thực hiện lệnh gọi API
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán thời gian hiện tại khi insert dữ liệu mới vào DB
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}