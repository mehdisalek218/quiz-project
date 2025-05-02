
package com.quizwizard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String text;
    
    @Enumerated(EnumType.STRING)
    private QuestionType type;
    
    @ElementCollection
    private List<String> options;
    
    private String correctAnswer;
    
    private Integer durationSeconds;
    
    @ManyToOne
    @JoinColumn(name = "exam_id")
    private Exam exam;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<StudentResponse> responses;
}
