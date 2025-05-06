
package com.quizwizard.repository;

import com.quizwizard.model.Exam;
import com.quizwizard.model.ExamResult;
import com.quizwizard.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    Optional<ExamResult> findByStudentAndExam(Student student, Exam exam);
}
