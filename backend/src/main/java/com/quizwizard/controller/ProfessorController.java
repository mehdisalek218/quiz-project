package com.quizwizard.controller;

import com.quizwizard.dto.LoginRequest;
import com.quizwizard.dto.ProfessorDto;
import com.quizwizard.model.Professor;
import com.quizwizard.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/professors")
@CrossOrigin(origins = "*")
public class ProfessorController {

    @Autowired
    private ProfessorRepository professorRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Professor> professorOpt = professorRepository.findByEmail(loginRequest.getEmail());
        
        if (professorOpt.isPresent() && professorOpt.get().getPassword().equals(loginRequest.getPassword())) {
            Professor professor = professorOpt.get();
            ProfessorDto dto = new ProfessorDto();
            dto.setId(professor.getId());
            dto.setName(professor.getName());
            dto.setEmail(professor.getEmail());
            return ResponseEntity.ok(dto);
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Professor professor) {
        if (professorRepository.findByEmail(professor.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        
        Professor savedProfessor = professorRepository.save(professor);
        ProfessorDto dto = new ProfessorDto();
        dto.setId(savedProfessor.getId());
        dto.setName(savedProfessor.getName());
        dto.setEmail(savedProfessor.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}
