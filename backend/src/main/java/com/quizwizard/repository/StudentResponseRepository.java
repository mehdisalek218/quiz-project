
package com.quizwizard.repository;

import com.quizwizard.model.Exam;
import com.quizwizard.model.Question;
import com.quizwizard.model.Student;
import com.quizwizard.model.StudentResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentResponseRepository extends JpaRepository<StudentResponse, Long> {
    List<StudentResponse> findByStudentAndExam(Student student, Exam exam);
    List<StudentResponse> findByQuestion(Question question);
}