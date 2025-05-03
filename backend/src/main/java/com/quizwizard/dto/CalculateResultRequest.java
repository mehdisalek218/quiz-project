
package com.quizwizard.dto;

import lombok.Data;

@Data
public class CalculateResultRequest {
    private Long studentId;
    private Long examId;
}