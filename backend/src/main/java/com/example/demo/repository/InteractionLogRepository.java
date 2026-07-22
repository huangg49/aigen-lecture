package com.example.demo.repository;

import com.example.demo.entity.InteractionLog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InteractionLogRepository extends JpaRepository<InteractionLog, Long> {

    /**
     * Kiểm tra học sinh đã từng trả lời câu hỏi này chưa (theo BR-06).
     * Dùng để xác định isFirstAttempt.
     */
    boolean existsByStudent_UserIdAndAiElement_ElementId(Integer studentId, Long elementId);

    @Query(value = "SELECT CASE EXTRACT(ISODOW FROM submitted_at) " +
                   "WHEN 1 THEN 'T2' WHEN 2 THEN 'T3' WHEN 3 THEN 'T4' " +
                   "WHEN 4 THEN 'T5' WHEN 5 THEN 'T6' WHEN 6 THEN 'T7' WHEN 7 THEN 'CN' END AS day, " +
                   "COUNT(log_id) AS quiz, " +
                   "0 AS flashcard, " +
                   "0 AS note " +
                   "FROM interaction_logs " + 
                   "WHERE submitted_at >= CURRENT_DATE - INTERVAL '7 days' " +
                   "GROUP BY EXTRACT(ISODOW FROM submitted_at) " +
                   "ORDER BY EXTRACT(ISODOW FROM submitted_at)", nativeQuery = true)
    List<Object[]> getWeeklyInteractions();

    @Query("SELECT COUNT(DISTINCT l.aiElement.lecture.lectureId) FROM InteractionLog l WHERE l.student.userId = :studentId")
    Long countWatchedVideosByStudentId(@org.springframework.data.repository.query.Param("studentId") Integer studentId);

    @Query("SELECT COALESCE(AVG(CASE WHEN l.isCorrect = true THEN 100.0 ELSE 0.0 END), 0.0) FROM InteractionLog l WHERE l.student.userId = :studentId")
    Double getAverageScoreByStudentId(@org.springframework.data.repository.query.Param("studentId") Integer studentId);

    @Query("SELECT COALESCE(AVG(CASE WHEN l.isCorrect = true THEN 100.0 ELSE 0.0 END), 0.0) FROM InteractionLog l WHERE l.aiElement.lecture.teacher.userId = :teacherId")
    Double getCorrectRateByTeacherId(@org.springframework.data.repository.query.Param("teacherId") Integer teacherId);
}
