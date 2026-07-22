package com.example.demo.service;

import com.example.demo.dto.StatisticsChartsResponse;
import com.example.demo.dto.StatisticsChartsResponse.*;
import com.example.demo.dto.StatisticsOverviewResponse;
import com.example.demo.dto.TopLectureResponse;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.InteractionLogRepository;
import com.example.demo.repository.LectureRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.CostLogRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final UserRepository userRepository;
    private final LectureRepository lectureRepository;
    private final InteractionLogRepository interactionLogRepository;
    private final CostLogRepository costLogRepository;

    public StatisticsOverviewResponse getOverview() {
        // --- LIVE QUERIES ---
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(UserRole.STUDENT);
        long totalTeachers = userRepository.countByRole(UserRole.TEACHER);
        long totalLectures = lectureRepository.count();
        long totalInteractions = interactionLogRepository.count();

        // Lấy số liệu thật từ DB
        double llmCostUsd = costLogRepository.getTotalCost(); 

        // --- MOCK DATA ---
        long totalAiGeneratedLectures = Math.round(totalLectures * 0.95);
        String serverUptime = "99.9%";

        return new StatisticsOverviewResponse(
                totalUsers,
                totalStudents,
                totalTeachers,
                totalLectures,
                totalAiGeneratedLectures,
                totalInteractions,
                llmCostUsd,
                serverUptime
        );
    }

    public StatisticsChartsResponse getCharts() {
        // 1. Tạo sẵn khung 12 tháng mặc định bằng 0
        List<MonthlyUserGrowth> userGrowth = new java.util.ArrayList<>();
        List<MonthlyLectureCount> lectureGrowth = new java.util.ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            userGrowth.add(new MonthlyUserGrowth("T" + i, 0, 0));
            lectureGrowth.add(new MonthlyLectureCount("T" + i, 0, 0));
        }

        // 2. Lấy dữ liệu Tăng trưởng User từ DB và đắp đè vào khung
        for (Object[] row : userRepository.getUserGrowth()) {
            int monthIndex = Integer.parseInt(row[0].toString()) - 1; // Tháng 7 -> index 6
            int students = ((Number) row[1]).intValue();
            int teachers = ((Number) row[2]).intValue();
            userGrowth.set(monthIndex, new MonthlyUserGrowth("T" + (monthIndex + 1), students, teachers));
        }

        // 3. Lấy dữ liệu Bài giảng từ DB và đắp đè vào khung
        for (Object[] row : lectureRepository.getLectureGrowth()) {
            int monthIndex = Integer.parseInt(row[0].toString()) - 1;
            int total = ((Number) row[1]).intValue();
            int aiGenerated = ((Number) row[2]).intValue();
            lectureGrowth.set(monthIndex, new MonthlyLectureCount("T" + (monthIndex + 1), total, aiGenerated));
        }

        // 4. Lấy dữ liệu Tương tác (giữ nguyên vì 7 ngày tuần nào cũng đủ hoặc tự co giãn)
        List<WeeklyInteraction> weeklyInteractions = interactionLogRepository.getWeeklyInteractions().stream()
            .map(row -> new WeeklyInteraction(
                row[0].toString(),
                ((Number) row[1]).intValue(),
                ((Number) row[2]).intValue(),
                ((Number) row[3]).intValue()
            )).toList();

        // 5. Phân bố vai trò
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(UserRole.STUDENT);
        long totalTeachers = userRepository.countByRole(UserRole.TEACHER);
        
        List<RoleDistribution> roleDistribution = List.of(
                new RoleDistribution("Học sinh", totalStudents, "#10b981"),
                new RoleDistribution("Giáo viên", totalTeachers, "#8b5cf6"),
                new RoleDistribution("Admin", totalUsers - totalStudents - totalTeachers, "#f59e0b")
        );

        return new StatisticsChartsResponse(userGrowth, lectureGrowth, weeklyInteractions, roleDistribution);
    }
    
    /**
     * Lấy top 5 bài giảng nổi bật từ DB phục vụ cho Analytics Dashboard
     */
    public List<TopLectureResponse> getTopLectures() {
        return lectureRepository.findTopLectures(PageRequest.of(0, 5));
    }
}