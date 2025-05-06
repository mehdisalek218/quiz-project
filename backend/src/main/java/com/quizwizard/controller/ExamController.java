
package com.quizwizard.controller;

import com.quizwizard.dto.ExamDto;
import com.quizwizard.dto.QuestionDto;
import com.quizwizard.model.Exam;
import com.quizwizard.model.Professor;
import com.quizwizard.model.Question;
import com.quizwizard.repository.ExamRepository;
import com.quizwizard.repository.ProfessorRepository;
import com.quizwizard.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ProfessorRepository professorRepository;
    
    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping
    public ResponseEntity<List<ExamDto>> getAllExams(@RequestParam Long professorId) {
        Optional<Professor> professorOpt = professorRepository.findById(professorId);
        
        if (professorOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Exam> exams = examRepository.findByProfessor(professorOpt.get());
        List<ExamDto> examDtos = exams.stream().map(this::convertToDto).collect(Collectors.toList());
        
        return ResponseEntity.ok(examDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDto> getExam(@PathVariable Long id) {
        Optional<Exam> examOpt = examRepository.findById(id);
        
        if (examOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToDto(examOpt.get()));
    }

    @GetMapping("/access/{accessLink}")
    public ResponseEntity<ExamDto> getExamByAccessLink(@PathVariable String accessLink) {
        Optional<Exam> examOpt = examRepository.findByAccessLink(accessLink);
        
        if (examOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        ExamDto examDto = convertToDto(examOpt.get());
        
        // Vérifier si l'examen a des questions
        if (examDto.getQuestions() == null || examDto.getQuestions().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(null); // Retourner une erreur pour indiquer que l'examen n'a pas de questions
        }
        
        // Cacher les réponses correctes lorsqu'on sert l'examen aux étudiants
        examDto.getQuestions().forEach(q -> q.setCorrectAnswer(null));
        
        return ResponseEntity.ok(examDto);
    }

    @PostMapping
    public ResponseEntity<ExamDto> createExam(@RequestBody ExamDto examDto) {
        Optional<Professor> professorOpt = professorRepository.findById(examDto.getProfessorId());
        
        if (professorOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Exam exam = new Exam();
        exam.setName(examDto.getName());
        exam.setDescription(examDto.getDescription());
        exam.setProfessor(professorOpt.get());
        exam.setAccessLink(generateAccessLink());
        exam.setQuestions(new ArrayList<>());
        
        Exam savedExam = examRepository.save(exam);
        
        // Si des questions sont fournies, les créer également
        if (examDto.getQuestions() != null && !examDto.getQuestions().isEmpty()) {
            for (QuestionDto questionDto : examDto.getQuestions()) {
                Question question = new Question();
                question.setText(questionDto.getText());
                question.setType(questionDto.getType());
                question.setOptions(questionDto.getOptions());
                question.setCorrectAnswer(questionDto.getCorrectAnswer());
                question.setDurationSeconds(questionDto.getDurationSeconds());
                question.setExam(savedExam);
                
                questionRepository.save(question);
            }
            
            // Recharger l'examen pour récupérer les questions sauvegardées
            savedExam = examRepository.findById(savedExam.getId()).orElse(savedExam);
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDto(savedExam));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamDto> updateExam(@PathVariable Long id, @RequestBody ExamDto examDto) {
        Optional<Exam> examOpt = examRepository.findById(id);
        
        if (examOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Exam exam = examOpt.get();
        exam.setName(examDto.getName());
        exam.setDescription(examDto.getDescription());
        
        // Mettre à jour les questions existantes et en ajouter de nouvelles si nécessaire
        if (examDto.getQuestions() != null) {
            // Supprimer les questions existantes
            List<Question> existingQuestions = questionRepository.findByExam(exam);
            questionRepository.deleteAll(existingQuestions);
            
            // Ajouter les nouvelles questions
            List<Question> newQuestions = new ArrayList<>();
            for (QuestionDto questionDto : examDto.getQuestions()) {
                Question question = new Question();
                question.setText(questionDto.getText());
                question.setType(questionDto.getType());
                question.setOptions(questionDto.getOptions());
                question.setCorrectAnswer(questionDto.getCorrectAnswer());
                question.setDurationSeconds(questionDto.getDurationSeconds());
                question.setExam(exam);
                
                newQuestions.add(question);
            }
            
            questionRepository.saveAll(newQuestions);
        }
        
        Exam updatedExam = examRepository.save(exam);
        
        return ResponseEntity.ok(convertToDto(updatedExam));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        if (!examRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        examRepository.deleteById(id);
        
        return ResponseEntity.noContent().build();
    }

    private ExamDto convertToDto(Exam exam) {
        ExamDto dto = new ExamDto();
        dto.setId(exam.getId());
        dto.setName(exam.getName());
        dto.setDescription(exam.getDescription());
        dto.setAccessLink(exam.getAccessLink());
        dto.setCreatedAt(exam.getCreatedAt());
        dto.setProfessorId(exam.getProfessor().getId());
        
        List<QuestionDto> questionDtos = new ArrayList<>();
        if (exam.getQuestions() != null) {
            questionDtos = exam.getQuestions().stream().map(this::convertQuestionToDto).collect(Collectors.toList());
        }
        dto.setQuestions(questionDtos);
        
        return dto;
    }

    private QuestionDto convertQuestionToDto(Question question) {
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

    private String generateAccessLink() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
