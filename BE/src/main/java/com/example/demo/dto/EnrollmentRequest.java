package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public record EnrollmentRequest(
        @NotNull Integer studentId
) {
}
