
package com.quizwizard.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamResultDto {
    private Long id;
    private Long studentId;
    private Long examId;
    private Integer totalScore;
    private Integer maxScore;
    private Double percentage;
    private LocalDateTime completedAt;
    private List<QuestionResultDto> questionResults;
}
