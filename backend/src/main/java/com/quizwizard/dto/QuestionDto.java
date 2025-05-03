
package com.quizwizard.dto;

import com.quizwizard.model.QuestionType;
import lombok.Data;

import java.util.List;

@Data
public class QuestionDto {
    private Long id;
    private String text;
    private QuestionType type;
    private List<String> options;
    private String correctAnswer;
    private Integer durationSeconds;
    private Long examId;
}