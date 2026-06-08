package com.example.demo.dto;

import com.example.demo.entity.UserStatus;
import java.time.LocalDateTime;

public record EnrollmentResponse(
        Integer classId,
        Integer studentId,
        String studentName,
        LocalDateTime enrolledAt,
        UserStatus status
) {
}
