package com.example.demo.controller;

import com.example.demo.dto.EnrollmentRequest;
import com.example.demo.dto.EnrollmentResponse;
import com.example.demo.dto.EnrollmentStatusRequest;
import com.example.demo.service.EnrollmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping("/enrollments")
    @Operation(summary = "List enrollments")
    public List<EnrollmentResponse> findAll() {
        return enrollmentService.findAll();
    }

    @GetMapping("/classes/{classId}/students")
    @Operation(summary = "List students in a class")
    public List<EnrollmentResponse> findByClass(@PathVariable Integer classId) {
        return enrollmentService.findByClass(classId);
    }

    @GetMapping("/students/{studentId}/classes")
    @Operation(summary = "List classes for a student")
    public List<EnrollmentResponse> findByStudent(@PathVariable Integer studentId) {
        return enrollmentService.findByStudent(studentId);
    }

    @PostMapping("/classes/{classId}/students")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Enroll a student in a class")
    public EnrollmentResponse enroll(
            @PathVariable Integer classId,
            @Valid @RequestBody EnrollmentRequest request
    ) {
        return enrollmentService.enroll(classId, request);
    }

    @PatchMapping("/classes/{classId}/students/{studentId}")
    @Operation(summary = "Update enrollment status")
    public EnrollmentResponse updateStatus(
            @PathVariable Integer classId,
            @PathVariable Integer studentId,
            @Valid @RequestBody EnrollmentStatusRequest request
    ) {
        return enrollmentService.updateStatus(classId, studentId, request);
    }

    @DeleteMapping("/classes/{classId}/students/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Deactivate enrollment")
    public void deactivate(@PathVariable Integer classId, @PathVariable Integer studentId) {
        enrollmentService.deactivate(classId, studentId);
    }
}
