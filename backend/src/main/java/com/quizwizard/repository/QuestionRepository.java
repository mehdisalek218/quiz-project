
package com.quizwizard.repository;

import com.quizwizard.model.Exam;
import com.quizwizard.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExam(Exam exam);
}