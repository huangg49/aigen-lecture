package com.example.demo.controller;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.ChangePasswordRequest;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.entity.UserStatus;
import com.example.demo.exception.BadRequestException;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.EmailService;
import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller — đăng ký và đăng nhập.
 * Tất cả endpoint trong /api/auth/** đều public (không cần JWT).
 */
@Tag(name = "Authentication", description = "Đăng ký, đăng nhập, lấy JWT token")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    /**
     * POST /api/auth/register
     * Đăng ký tài khoản mới. Password được hash bằng BCrypt trước khi lưu.
     */
    @Operation(summary = "Đăng ký tài khoản mới")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.ACTIVE);

        User saved = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(saved);
        String token = jwtTokenProvider.generateToken(principal);

        return ResponseEntity.ok(new AuthResponse(
                token,
                saved.getUserId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole()
        ));
    }

    /**
     * POST /api/auth/login
     * Đăng nhập bằng email + password. Trả về JWT token nếu thành công.
     */
    @Operation(summary = "Đăng nhập và nhận JWT token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Email hoặc password không đúng"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Email hoặc password không đúng");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Tài khoản đã bị vô hiệu hóa");
        }

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtTokenProvider.generateToken(principal);

        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        ));
    }

    /**
     * POST /api/auth/change-password
     * Đổi mật khẩu cho user đang đăng nhập (Yêu cầu JWT)
     */
    @Operation(summary = "Đổi mật khẩu (yêu cầu đang đăng nhập)")
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal UserPrincipal principal) {

        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu cũ không chính xác");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    /**
     * POST /api/auth/forgot-password
     * Gửi yêu cầu quên mật khẩu, sinh token reset.
     */
    @Operation(summary = "Yêu cầu khôi phục mật khẩu qua email")
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tài khoản với email này"));

        String resetToken = java.util.UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setTokenExpiryDate(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);

        return ResponseEntity.ok("Đã gửi hướng dẫn khôi phục mật khẩu qua email.");
    }

    /**
     * POST /api/auth/reset-password
     * Đổi mật khẩu mới bằng token.
     */
    @Operation(summary = "Xác nhận đổi mật khẩu mới bằng token")
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.token())
                .orElseThrow(() -> new BadRequestException("Mã xác thực không hợp lệ"));

        if (user.getTokenExpiryDate() == null || user.getTokenExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Mã xác thực đã hết hạn");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        
        // Xóa token sau khi dùng xong
        user.setResetToken(null);
        user.setTokenExpiryDate(null);
        userRepository.save(user);

        return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công.");
    }
}
