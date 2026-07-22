package com.example.demo.controller;

import com.example.demo.dto.StudentDashboardStatsResponse;
import com.example.demo.dto.TeacherDashboardStatsResponse;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard", description = "API thống kê cho dashboard của Giáo viên và Học sinh")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Lấy dữ liệu thống kê cho Teacher Dashboard", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<TeacherDashboardStatsResponse> getTeacherDashboardStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getTeacherDashboardStats(principal.getUserId()));
    }

    @Operation(summary = "Lấy dữ liệu thống kê cho Student Dashboard", security = @SecurityRequirement(name = "bearerAuth"))
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardStatsResponse> getStudentDashboardStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getStudentDashboardStats(principal.getUserId()));
    }
}
