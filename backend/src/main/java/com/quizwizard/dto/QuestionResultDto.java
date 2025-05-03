
package com.quizwizard.dto;

import lombok.Data;

@Data
public class QuestionResultDto {
    private Long questionId;
    private Boolean isCorrect;
    private String studentAnswer;
    private String correctAnswer;
}