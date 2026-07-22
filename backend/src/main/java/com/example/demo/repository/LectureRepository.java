package com.example.demo.repository;

import com.example.demo.dto.TopLectureResponse;
import com.example.demo.entity.Lecture;
import com.example.demo.entity.VideoStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository cho Lecture entity.
 * Soft-delete được xử lý tự động qua @Where(clause = "deleted_at IS NULL") trong entity.
 */
public interface LectureRepository extends JpaRepository<Lecture, Long> {

    /**
     * Tìm tất cả bài giảng của một teacher (phân trang + sắp xếp).
     * Hỗ trợ Search/Sort/Paging/Filtering theo chuẩn REST API (FR task 23).
     */
    @EntityGraph(attributePaths = {"teacher"})
    Page<Lecture> findByTeacher_UserId(Integer teacherId, Pageable pageable);

    /**
     * Tìm kiếm bài giảng theo title (case-insensitive, hỗ trợ Filtering).
     */
    @EntityGraph(attributePaths = {"teacher"})
    Page<Lecture> findByTeacher_UserIdAndTitleContainingIgnoreCase(
            Integer teacherId, String titleKeyword, Pageable pageable);

    /**
     * Tìm kiếm bài giảng theo title trên toàn hệ thống (cho Student).
     */
    @EntityGraph(attributePaths = {"teacher"})
    Page<Lecture> findByTitleContainingIgnoreCase(String titleKeyword, Pageable pageable);

    /**
     * Lấy tất cả bài giảng có phân trang.
     */
    @EntityGraph(attributePaths = {"teacher"})
    Page<Lecture> findAll(Pageable pageable);

    /**
     * Lấy danh sách bài giảng đang trong trạng thái PROCESSING hoặc PENDING
     * để background job poll video-service.
     */
    @Query("SELECT l FROM Lecture l WHERE l.videoStatus IN :statuses AND l.videoJobId IS NOT NULL")
    List<Lecture> findByVideoStatusIn(@Param("statuses") List<VideoStatus> statuses);

    /**
     * Lấy danh sách Top 10 bài giảng được xem nhiều nhất (theo views).
     * Sử dụng DTO projection để chỉ lấy các field cần thiết.
     */
    @Query("SELECT new com.example.demo.dto.TopLectureResponse(l.lectureId, l.title, l.teacher.name, l.views, l.rating) " +
           "FROM Lecture l " +
           "ORDER BY l.views DESC")
    List<TopLectureResponse> findTopLectures(Pageable pageable);

    long countByTeacher_UserId(Integer teacherId);

    @Query("SELECT COALESCE(SUM(l.durationSeconds), 0) FROM Lecture l WHERE l.teacher.userId = :teacherId")
    long sumDurationSecondsByTeacher_UserId(@Param("teacherId") Integer teacherId);

    @Query(value = "SELECT TO_CHAR(created_at, 'FMMM') AS month, " +
                   "COUNT(lecture_id) AS total, " +
                   "SUM(CASE WHEN original_source LIKE '%LLM%' OR original_source LIKE '%JSON%' THEN 1 ELSE 0 END) AS ai " +
                   "FROM lectures " +
                   "WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                   "GROUP BY EXTRACT(MONTH FROM created_at), TO_CHAR(created_at, 'FMMM') " +
                   "ORDER BY EXTRACT(MONTH FROM created_at)", nativeQuery = true)
    List<Object[]> getLectureGrowth();
}
