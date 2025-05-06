
package com.quizwizard.controller;

import com.quizwizard.dto.StudentResponseDto;
import com.quizwizard.model.Exam;
import com.quizwizard.model.Question;
import com.quizwizard.model.Student;
import com.quizwizard.model.StudentResponse;
import com.quizwizard.repository.ExamRepository;
import com.quizwizard.repository.QuestionRepository;
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
@RequestMapping("/api/responses")
@CrossOrigin(origins = "*")
public class StudentResponseController {

    @Autowired
    private StudentResponseRepository responseRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ExamRepository examRepository;
    
    @Autowired
    private QuestionRepository questionRepository;

    @PostMapping
    public ResponseEntity<StudentResponseDto> submitResponse(@RequestBody StudentResponseDto requestDto) {
        // Validate all entities exist
        Optional<Student> studentOpt = studentRepository.findById(requestDto.getStudentId());
        Optional<Exam> examOpt = examRepository.findById(requestDto.getExamId());
        Optional<Question> questionOpt = questionRepository.findById(requestDto.getQuestionId());
        
        if (studentOpt.isEmpty() || examOpt.isEmpty() || questionOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Student student = studentOpt.get();
        Exam exam = examOpt.get();
        Question question = questionOpt.get();
        
        // Create and save response
        StudentResponse response = new StudentResponse();
        response.setStudent(student);
        response.setExam(exam);
        response.setQuestion(question);
        response.setAnswer(requestDto.getAnswer());
        
        // Check if answer is correct
        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(requestDto.getAnswer());
        response.setIsCorrect(isCorrect);
        
        // Save response
        StudentResponse savedResponse = responseRepository.save(response);
        
        // Convert to DTO and return
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(savedResponse.getId());
        dto.setStudentId(student.getId());
        dto.setExamId(exam.getId());
        dto.setQuestionId(question.getId());
        dto.setAnswer(savedResponse.getAnswer());
        dto.setIsCorrect(savedResponse.getIsCorrect());
        dto.setSubmittedAt(savedResponse.getSubmittedAt());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
    
    @GetMapping("/student/{studentId}/exam/{examId}")
    public ResponseEntity<List<StudentResponseDto>> getResponsesByStudentAndExam(
            @PathVariable Long studentId, 
            @PathVariable Long examId) {
        
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        Optional<Exam> examOpt = examRepository.findById(examId);
        
        if (studentOpt.isEmpty() || examOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Student student = studentOpt.get();
        Exam exam = examOpt.get();
        
        List<StudentResponse> responses = responseRepository.findByStudentAndExam(student, exam);
        List<StudentResponseDto> responseDtos = responses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responseDtos);
    }
    
    private StudentResponseDto convertToDto(StudentResponse response) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(response.getId());
        dto.setStudentId(response.getStudent().getId());
        dto.setExamId(response.getExam().getId());
        dto.setQuestionId(response.getQuestion().getId());
        dto.setAnswer(response.getAnswer());
        dto.setIsCorrect(response.getIsCorrect());
        dto.setSubmittedAt(response.getSubmittedAt());
        return dto;
    }
}