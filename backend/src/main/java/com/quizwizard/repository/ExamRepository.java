
package com.quizwizard.repository;

import com.quizwizard.model.Exam;
import com.quizwizard.model.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByProfessor(Professor professor);
    Optional<Exam> findByAccessLink(String accessLink);
}