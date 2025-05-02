
package com.quizwizard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class ExamResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer totalScore;
    
    private Integer maxScore;
    
    private Double percentage;
    
    private LocalDateTime completedAt;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;
    
    @PrePersist
    protected void onCreate() {
        completedAt = LocalDateTime.now();
    }
}