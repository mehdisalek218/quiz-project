package com.quizwizard.controller;

import com.quizwizard.dto.QuestionDto;
import com.quizwizard.model.Exam;
import com.quizwizard.model.Question;
import com.quizwizard.repository.ExamRepository;
import com.quizwizard.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private ExamRepository examRepository;
    
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<QuestionDto>> getQuestionsByExamId(@PathVariable Long examId) {
        Optional<Exam> examOpt = examRepository.findById(examId);
        
        if (examOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Question> questions = questionRepository.findByExam(examOpt.get());
        List<QuestionDto> questionDtos = questions.stream().map(this::convertToDto).collect(Collectors.toList());
        
        return ResponseEntity.ok(questionDtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestion(@PathVariable Long id) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        
        if (questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToDto(questionOpt.get()));
    }
    
    @PostMapping
    public ResponseEntity<QuestionDto> createQuestion(@RequestBody QuestionDto questionDto) {
        Optional<Exam> examOpt = examRepository.findById(questionDto.getExamId());
        
        if (examOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Question question = new Question();
        question.setText(questionDto.getText());
        question.setType(questionDto.getType());
        question.setOptions(questionDto.getOptions());
        question.setCorrectAnswer(questionDto.getCorrectAnswer());
        question.setDurationSeconds(questionDto.getDurationSeconds());
        question.setExam(examOpt.get());
        
        Question savedQuestion = questionRepository.save(question);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedQuestion));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable Long id, @RequestBody QuestionDto questionDto) {
        Optional<Question> questionOpt = questionRepository.findById(id);
        
        if (questionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Question question = questionOpt.get();
        question.setText(questionDto.getText());
        question.setType(questionDto.getType());
        question.setOptions(questionDto.getOptions());
        question.setCorrectAnswer(questionDto.getCorrectAnswer());
        question.setDurationSeconds(questionDto.getDurationSeconds());
        
        Question updatedQuestion = questionRepository.save(question);
        
        return ResponseEntity.ok(convertToDto(updatedQuestion));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        questionRepository.deleteById(id);
        
        return ResponseEntity.noContent().build();
    }
    
    private QuestionDto convertToDto(Question question) {
        QuestionDto dto = new QuestionDto();
        dto.setId(question.getId());
        dto.setText(question.getText());
        dto.setType(question.getType());
        dto.setOptions(question.getOptions());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        dto.setDurationSeconds(question.getDurationSeconds());
        dto.setExamId(question.getExam().getId());
        return dto;
    }
}
