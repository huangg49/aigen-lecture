package com.example.demo.dto;

import com.example.demo.entity.UserStatus;
import jakarta.validation.constraints.Size;

public record ClassUpdateRequest(
        Integer teacherId,
        @Size(max = 150) String className,
        @Size(max = 20) String classCode,
        @Size(max = 500) String description,
        UserStatus status
) {
}
