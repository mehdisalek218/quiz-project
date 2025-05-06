
package com.quizwizard.controller;

import com.quizwizard.dto.StudentRegistrationRequest;
import com.quizwizard.dto.StudentDto;
import com.quizwizard.model.Exam;
import com.quizwizard.model.Student;
import com.quizwizard.repository.ExamRepository;
import com.quizwizard.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private ExamRepository examRepository;

    @PostMapping("/register")
    public ResponseEntity<StudentDto> registerForExam(@RequestBody StudentRegistrationRequest request) {
        // Validate exam exists
        Optional<Exam> examOpt = examRepository.findById(request.getExamId());
        if (examOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Find existing student or create new one
        Student student;
        Optional<Student> existingStudent = studentRepository.findByEmail(request.getEmail());
        
        if (existingStudent.isPresent()) {
            student = existingStudent.get();
        } else {
            student = new Student();
            student.setEmail(request.getEmail());
            student = studentRepository.save(student);
        }
        
        // Convert to DTO and return
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setEmail(student.getEmail());
        dto.setRole("STUDENT");
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getStudent(@PathVariable Long id) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        
        if (studentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Student student = studentOpt.get();
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setEmail(student.getEmail());
        dto.setRole("STUDENT");
        
        return ResponseEntity.ok(dto);
    }
}