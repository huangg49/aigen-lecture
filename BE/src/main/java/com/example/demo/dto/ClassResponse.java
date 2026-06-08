package com.example.demo.dto;

import com.example.demo.entity.UserStatus;
import java.time.LocalDateTime;

public record ClassResponse(
        Integer classId,
        Integer teacherId,
        String teacherName,
        String className,
        String classCode,
        String description,
        UserStatus status,
        LocalDateTime createdAt
) {
}
