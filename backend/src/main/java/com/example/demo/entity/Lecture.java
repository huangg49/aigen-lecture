package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

/**
 * Entity bài giảng (Lecture).
 *
 * Field theo PROJECT_CONTEXT.md (LectureID, TeacherID, Title, OriginalSource, CreatedDate)
 * + bổ sung theo pivot: videoUrl, videoStatus, videoJobId (lưu jobId từ video-service để poll).
 *
 * Soft-delete theo BR-08: không hard-delete, chỉ đổi deletedAt.
 */
@Entity
@Getter
@Setter
@SQLDelete(sql = "UPDATE lectures SET deleted_at = NOW() WHERE lecture_id = ?")
@SQLRestriction("deleted_at IS NULL")
@Table(name = "lectures")
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lecture_id")
    private Long lectureId;

    /** Lượt xem bài giảng. Mặc định là 0. */
    @Column(name = "views", nullable = false, columnDefinition = "bigint default 0")
    private Long views = 0L;

    /** Đánh giá trung bình của bài giảng (ví dụ: 4.8). Mặc định là 0.0. */
    @Column(name = "rating", nullable = false, columnDefinition = "double precision default 0.0")
    private Double rating = 0.0;

    /**
     * Teacher sở hữu bài giảng — FK tới User.
     * Dùng @ManyToOne lazy để tránh N+1 query.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    /**
     * Nội dung gốc trích xuất từ PDF/DOCX (hoặc script JSON từ LLM).
     * Dạng TEXT để chứa nội dung dài.
     */
    @Column(name = "original_source", columnDefinition = "TEXT")
    private String originalSource;

    // ── Video pivot fields ────────────────────────────────────────────────────

    /**
     * Job ID trả về từ video-service (dùng để poll trạng thái).
     * null khi chưa gửi render request.
     */
    @Column(name = "video_job_id", length = 36)
    private String videoJobId;

    /**
     * URL tới file video MP4 (có sau khi videoStatus = DONE).
     * Giai đoạn 1: URL local của video-service.
     * Giai đoạn 2: URL Firebase Storage.
     */
    @Column(name = "video_url", length = 500)
    private String videoUrl;

    /**
     * Trạng thái render video.
     * Default PENDING — chưa gửi yêu cầu render.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "video_status", nullable = false, length = 20)
    private VideoStatus videoStatus = VideoStatus.PENDING;

    // ── Timestamps ────────────────────────────────────────────────────────────

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Soft-delete timestamp. null = chưa bị xóa. */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (videoStatus == null) {
            videoStatus = VideoStatus.PENDING;
        }
    }
}
