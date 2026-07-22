package com.example.demo.service;

import com.example.demo.dto.UserResponse;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.entity.UserStatus;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    // Lấy danh sách tất cả người dùng
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(
                        user.getUserId(),
                        user.getRole(),
                        user.getName(),
                        user.getEmail(),
                        user.getStatus(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    // Cập nhật linh hoạt Role hoặc Status
    public UserResponse patchUser(Integer userId, Map<String, String> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));
        
        if (user.getRole() == UserRole.ADMIN) {
            throw new RuntimeException("Hành động bị từ chối: Không được phép chỉnh sửa Quản trị viên.");
        }

        // Cập nhật Quyền (Role) nếu có trong request
        if (updates.containsKey("role")) {
            user.setRole(UserRole.valueOf(updates.get("role").toUpperCase()));
        }
        
        // Cập nhật Trạng thái (Khóa/Mở khóa) nếu có trong request
        if (updates.containsKey("status")) {
            user.setStatus(UserStatus.valueOf(updates.get("status").toUpperCase()));
        }
        
        User updatedUser = userRepository.save(user);
        
        return new UserResponse(
                updatedUser.getUserId(), 
                updatedUser.getRole(), 
                updatedUser.getName(), 
                updatedUser.getEmail(),
                updatedUser.getStatus(),
                updatedUser.getCreatedAt()
        );
    }
}