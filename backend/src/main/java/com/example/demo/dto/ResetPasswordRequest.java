package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO để đặt lại mật khẩu bằng token.
 * Dùng cho POST /api/auth/reset-password
 */
public record ResetPasswordRequest(
        @NotBlank(message = "Mã xác thực (token) không được để trống")
        String token,

        @NotBlank(message = "Mật khẩu mới không được để trống")
        @Size(min = 8, message = "Mật khẩu mới phải có ít nhất 8 ký tự")
        String newPassword
) {}