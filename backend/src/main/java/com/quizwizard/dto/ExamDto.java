package com.quizwizard.dto;

import com.quizwizard.model.Question;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamDto {
    private Long id;
    private String name;
    private String description;
    private String accessLink;
    private LocalDateTime createdAt;
    private Long professorId;
    private List<QuestionDto> questions;
}
