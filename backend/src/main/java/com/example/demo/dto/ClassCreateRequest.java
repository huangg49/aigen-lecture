package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClassCreateRequest(
        @NotNull Integer teacherId,
        @NotBlank @Size(max = 150) String className,
        @NotBlank @Size(max = 20) String classCode,
        @Size(max = 500) String description
) {
}
