
package com.quizwizard.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StudentResponseDto {
    private Long id;
    private Long studentId;
    private Long examId;
    private Long questionId;
    private String answer;
    private Boolean isCorrect;
    private LocalDateTime submittedAt;
}