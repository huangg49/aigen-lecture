package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO cho yêu cầu khôi phục mật khẩu.
 * Dùng cho POST /api/auth/forgot-password
 */
public record ForgotPasswordRequest(
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email
) {}