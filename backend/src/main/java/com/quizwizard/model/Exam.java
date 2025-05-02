
package com.quizwizard.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    private String description;
    
    @Column(unique = true)
    private String accessLink;
    
    private LocalDateTime createdAt;
    
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    private List<Question> questions;
    
    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL)
    private List<ExamResult> results;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
