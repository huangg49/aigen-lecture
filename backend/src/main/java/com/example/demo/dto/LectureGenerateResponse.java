package com.example.demo.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Response từ LlmService sau khi Gemini sinh ra kịch bản bài giảng.
 * Chứa cả slides (cho video) và quizzes (cho tương tác học sinh).
 * Gemini có thể không sinh quizzes → field quizzes có thể null/empty, không crash.
 */
@Data
public class LectureGenerateResponse {

    private List<SlideDto> slides;

    /** Có thể null nếu Gemini không sinh ra quiz — xử lý an toàn ở frontend */
    private List<QuizDto> quizzes;

    @Data
    public static class SlideDto {
        private String title;
        private List<String> bulletPoints;
        @JsonProperty("narrationText")
        @JsonAlias({"script", "text", "narration", "audioText"})
        private String narrationText;
        private String imagePrompt;
    }

    @Data
    public static class QuizDto {
        private String questionText;
        /** 4 đáp án dạng: ["A. ...", "B. ...", "C. ...", "D. ..."] */
        private List<String> options;
        /** Ký tự đáp án đúng: "A", "B", "C", hoặc "D" */
        private String correctAnswer;
    }
}
