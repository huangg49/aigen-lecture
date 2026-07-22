package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDashboardStatsResponse {
    private long totalLectures;
    private long totalStudents;
    private double correctRate;
    private long totalDurationSeconds;
}
