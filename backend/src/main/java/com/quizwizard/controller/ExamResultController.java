
package com.quizwizard.controller;

import com.quizwizard.dto.CalculateResultRequest;
import com.quizwizard.dto.ExamResultDto;
import com.quizwizard.dto.QuestionResultDto;
import com.quizwizard.model.Exam;
import com.quizwizard.model.ExamResult;
import com.quizwizard.model.Student;
import com.quizwizard.model.StudentResponse;
import com.quizwizard.repository.ExamRepository;
import com.quizwizard.repository.ExamResultRepository;
import com.quizwizard.repository.StudentRepository;
import com.quizwizard.repository.StudentResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*")
public class ExamResultController {

    @Autowired
    private ExamResultRepository resultRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private StudentResponseRepository responseRepository;

    @PostMapping("/calculate")
    public ResponseEntity<ExamResultDto> calculateResults(@RequestBody CalculateResultRequest request) {
        Optional<Student> studentOpt = studentRepository.findById(request.getStudentId());
        Optional<Exam> examOpt = examRepository.findById(request.getExamId());
        
        if (studentOpt.isEmpty() || examOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Student student = studentOpt.get();
        Exam exam = examOpt.get();
        
        // Check if result already exists
        Optional<ExamResult> existingResult = resultRepository.findByStudentAndExam(student, exam);
        if (existingResult.isPresent()) {
            return ResponseEntity.ok(convertToDto(existingResult.get()));
        }
        
        // Get all responses for this student and exam
        List<StudentResponse> responses = responseRepository.findByStudentAndExam(student, exam);
        
        // Calculate score
        int correctAnswers = 0;
        for (StudentResponse response : responses) {
            if (response.getIsCorrect() != null && response.getIsCorrect()) {
                correctAnswers++;
            }
        }
        
        int totalQuestions = exam.getQuestions().size();
        double percentage = (double) correctAnswers / totalQuestions * 100;
        
        // Create result entity
        ExamResult result = new ExamResult();
        result.setStudent(student);
        result.setExam(exam);
        result.setTotalScore(correctAnswers);
        result.setMaxScore(totalQuestions);
        result.setPercentage(percentage);
        
        ExamResult savedResult = resultRepository.save(result);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedResult));
    }
    
    @GetMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<ExamResultDto> getResultByStudentAndExam(
            @PathVariable Long studentId, 
            @PathVariable Long examId) {
        
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        Optional<Exam> examOpt = examRepository.findById(examId);
        
        if (studentOpt.isEmpty() || examOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Student student = studentOpt.get();
        Exam exam = examOpt.get();
        
        Optional<ExamResult> resultOpt = resultRepository.findByStudentAndExam(student, exam);
        
        if (resultOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToDto(resultOpt.get()));
    }
    
    private ExamResultDto convertToDto(ExamResult result) {
        ExamResultDto dto = new ExamResultDto();
        dto.setId(result.getId());
        dto.setStudentId(result.getStudent().getId());
        dto.setExamId(result.getExam().getId());
        dto.setTotalScore(result.getTotalScore());
        dto.setMaxScore(result.getMaxScore());
        dto.setPercentage(result.getPercentage());
        dto.setCompletedAt(result.getCompletedAt());
        
        // Get response details for question results
        List<StudentResponse> responses = responseRepository.findByStudentAndExam(result.getStudent(), result.getExam());
        List<QuestionResultDto> questionResults = responses.stream().map(response -> {
            QuestionResultDto qrDto = new QuestionResultDto();
            qrDto.setQuestionId(response.getQuestion().getId());
            qrDto.setIsCorrect(response.getIsCorrect());
            qrDto.setStudentAnswer(response.getAnswer());
            qrDto.setCorrectAnswer(response.getQuestion().getCorrectAnswer());
            return qrDto;
        }).collect(Collectors.toList());
        
        dto.setQuestionResults(questionResults);
        
        return dto;
    }
}
