package com.example.demo.dto;

import com.example.demo.entity.UserStatus;
import jakarta.validation.constraints.NotNull;

public record EnrollmentStatusRequest(
        @NotNull UserStatus status
) {
}
