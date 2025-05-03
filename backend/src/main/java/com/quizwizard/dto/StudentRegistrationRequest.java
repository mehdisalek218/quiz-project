
package com.quizwizard.dto;

import lombok.Data;

@Data
public class StudentRegistrationRequest {
    private String email;
    private Long examId;
}