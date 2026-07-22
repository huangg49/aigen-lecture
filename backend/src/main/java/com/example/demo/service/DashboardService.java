package com.example.demo.service;

import com.example.demo.dto.StudentDashboardStatsResponse;
import com.example.demo.dto.TeacherDashboardStatsResponse;
import com.example.demo.repository.ClassStudentRepository;
import com.example.demo.repository.InteractionLogRepository;
import com.example.demo.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final LectureRepository lectureRepository;
    private final ClassStudentRepository classStudentRepository;
    private final InteractionLogRepository interactionLogRepository;

    @Transactional(readOnly = true)
    public TeacherDashboardStatsResponse getTeacherDashboardStats(Integer teacherId) {
        long totalLectures = lectureRepository.countByTeacher_UserId(teacherId);
        long totalStudents = classStudentRepository.countUniqueStudentsByTeacherId(teacherId);
        double correctRate = interactionLogRepository.getCorrectRateByTeacherId(teacherId);
        long totalDurationSeconds = lectureRepository.sumDurationSecondsByTeacher_UserId(teacherId);

        return new TeacherDashboardStatsResponse(totalLectures, totalStudents, correctRate, totalDurationSeconds);
    }

    @Transactional(readOnly = true)
    public StudentDashboardStatsResponse getStudentDashboardStats(Integer studentId) {
        long enrolledClasses = classStudentRepository.countByStudent_UserId(studentId);
        long watchedVideos = interactionLogRepository.countWatchedVideosByStudentId(studentId);
        double averageScore = interactionLogRepository.getAverageScoreByStudentId(studentId);

        return new StudentDashboardStatsResponse(enrolledClasses, watchedVideos, averageScore);
    }
}
