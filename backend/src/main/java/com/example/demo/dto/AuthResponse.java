package com.example.demo.dto;

import com.example.demo.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Response trả về sau khi đăng nhập / đăng ký thành công.
 * Frontend lưu token vào Zustand store để đính kèm vào các request tiếp theo.
 */
@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Integer userId;
    private String name;
    private String email;
    private UserRole role;
}
