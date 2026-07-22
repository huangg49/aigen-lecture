package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentDashboardStatsResponse {
    private long enrolledClasses;
    private long watchedVideos;
    private double averageScore;
}
