
package com.quizwizard.config;

import com.quizwizard.model.*;
import com.quizwizard.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void run(String... args) {
        // Create a professor
        Professor professor = new Professor();
        professor.setName("Professor Smith");
        professor.setEmail("prof@example.com");
        professor.setPassword("password123");
        professorRepository.save(professor);

        // Create an exam
        Exam exam = new Exam();
        exam.setName("Introduction to Biology");
        exam.setDescription("Test your knowledge of basic biology concepts");
        exam.setAccessLink("biology101");
        exam.setProfessor(professor);
        examRepository.save(exam);

        // Create questions
        Question question1 = new Question();
        question1.setText("What is the powerhouse of the cell?");
        question1.setType(QuestionType.MULTIPLE_CHOICE);
        question1.setOptions(Arrays.asList("Nucleus", "Mitochondria", "Golgi Apparatus", "Endoplasmic Reticulum"));
        question1.setCorrectAnswer("Mitochondria");
        question1.setDurationSeconds(30);
        question1.setExam(exam);
        questionRepository.save(question1);

        Question question2 = new Question();
        question2.setText("What is the chemical symbol for water?");
        question2.setType(QuestionType.DIRECT_ANSWER);
        question2.setCorrectAnswer("H2O");
        question2.setDurationSeconds(20);
        question2.setExam(exam);
        questionRepository.save(question2);

        System.out.println("Database initialized with sample data");
    }
}
