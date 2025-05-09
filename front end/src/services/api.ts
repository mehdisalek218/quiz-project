import axios from 'axios';
import { AuthResponse, Exam, ExamResult, Professor, Question, Student, StudentResponse, User } from '@/types';

// Create axios instance for API calls
const API_URL = 'http://localhost:8080/api';
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for demo purposes since we don't have a real backend yet
// In a real application, these would be API calls to the Spring Boot backend

const MOCK_DELAY = 500; // Simulate network delay

// Mock professors
const professors: Professor[] = [
  {
    id: '1',
    email: 'prof@example.com',
    name: 'Professor Smith',
    role: 'PROFESSOR',
    password: 'password123'
  }
];

// Mock exams
const exams: Exam[] = [
  {
    id: '1',
    name: 'Introduction to Biology',
    description: 'Test your knowledge of basic biology concepts',
    professorId: '1',
    questions: [],
    accessLink: 'biology-101',
    createdAt: new Date()
  }
];

// Mock questions
const questions: Question[] = [
  {
    id: '1',
    text: 'What is the powerhouse of the cell?',
    type: 'MULTIPLE_CHOICE',
    options: ['Nucleus', 'Mitochondria', 'Golgi Apparatus', 'Endoplasmic Reticulum'],
    correctAnswer: 'Mitochondria',
    durationSeconds: 30,
    examId: '1'
  },
  {
    id: '2',
    text: 'What is the chemical symbol for water?',
    type: 'DIRECT_ANSWER',
    correctAnswer: 'H2O',
    durationSeconds: 20,
    examId: '1'
  }
];

// Add questions to the exam
exams[0].questions = questions;

// Mock students
const students: Student[] = [];

// Mock responses
const studentResponses: StudentResponse[] = [];

// Mock results
const examResults: ExamResult[] = [];

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
  // Auth functions
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await axiosInstance.post('/professors/login', { email, password });
        
        // Create a mock token since we're not using Spring Security
        const token = 'mock-jwt-token';
        
        return {
          token,
          user: {
            ...response.data,
            role: 'PROFESSOR'
          }
        };
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    },
    
    register: async (professorData: Omit<Professor, 'id' | 'role'>): Promise<AuthResponse> => {
      try {
        const response = await axiosInstance.post('/professors/register', professorData);
        
        // Create a mock token since we're not using Spring Security
        const token = 'mock-jwt-token';
        
        return {
          token,
          user: {
            ...response.data,
            role: 'PROFESSOR'
          }
        };
      } catch (error) {
        throw new Error('Email already in use');
      }
    }
  },
  
  // Exam functions
  exams: {
    getAll: async (professorId: string): Promise<Exam[]> => {
      try {
        const response = await axiosInstance.get(`/exams?professorId=${professorId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch exams');
      }
    },
    
    getById: async (examId: string): Promise<Exam> => {
      try {
        const response = await axiosInstance.get(`/exams/${examId}`);
        return response.data;
      } catch (error) {
        throw new Error('Exam not found');
      }
    },
    
    getByAccessLink: async (accessLink: string): Promise<Exam> => {
      try {
        const response = await axiosInstance.get(`/exams/access/${accessLink}`);
        return response.data;
      } catch (error) {
        throw new Error('Exam not found');
      }
    },
    
    create: async (examData: Omit<Exam, 'id' | 'createdAt' | 'accessLink'>): Promise<Exam> => {
      try {
        const response = await axiosInstance.post('/exams', examData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to create exam');
      }
    },
    
    update: async (examId: string, examData: Partial<Exam>): Promise<Exam> => {
      try {
        const response = await axiosInstance.put(`/exams/${examId}`, examData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to update exam');
      }
    },
    
    delete: async (examId: string): Promise<void> => {
      try {
        await axiosInstance.delete(`/exams/${examId}`);
      } catch (error) {
        throw new Error('Failed to delete exam');
      }
    }
  },
  
  // Question functions
  questions: {
    getByExamId: async (examId: string): Promise<Question[]> => {
      try {
        const response = await axiosInstance.get(`/questions/exam/${examId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch questions');
      }
    },
    
    create: async (questionData: Omit<Question, 'id'>): Promise<Question> => {
      try {
        const response = await axiosInstance.post('/questions', questionData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to create question');
      }
    },
    
    update: async (questionId: string, questionData: Partial<Question>): Promise<Question> => {
      try {
        const response = await axiosInstance.put(`/questions/${questionId}`, questionData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to update question');
      }
    },
    
    delete: async (questionId: string): Promise<void> => {
      try {
        await axiosInstance.delete(`/questions/${questionId}`);
      } catch (error) {
        throw new Error('Failed to delete question');
      }
    }
  },
  
  // Student functions
  students: {
    register: async (email: string, examId: string): Promise<Student> => {
      try {
        const response = await axiosInstance.post('/students/register', { email, examId });
        return response.data;
      } catch (error) {
        throw new Error('Failed to register student');
      }
    }
  },
  
  // Response functions
  responses: {
    submit: async (responseData: Omit<StudentResponse, 'id' | 'isCorrect' | 'submittedAt'>): Promise<StudentResponse> => {
      try {
        const response = await axiosInstance.post('/responses', responseData);
        return response.data;
      } catch (error) {
        throw new Error('Failed to submit response');
      }
    },
    
    getByStudentAndExam: async (studentId: string, examId: string): Promise<StudentResponse[]> => {
      try {
        const response = await axiosInstance.get(`/responses/student/${studentId}/exam/${examId}`);
        return response.data;
      } catch (error) {
        throw new Error('Failed to fetch responses');
      }
    }
  },
  
  // Result functions
  results: {
    calculate: async (studentId: string, examId: string): Promise<ExamResult> => {
      try {
        const response = await axiosInstance.post(`/results/calculate`, { studentId, examId });
        return response.data;
      } catch (error) {
        throw new Error('Failed to calculate results');
      }
    },
    
    getByStudentAndExam: async (studentId: string, examId: string): Promise<ExamResult | null> => {
      try {
        const response = await axiosInstance.get(`/results/student/${studentId}/exam/${examId}`);
        return response.data;
      } catch (error) {
        return null;
      }
    }
  }
};

// For compatibility with existing code during migration to real backend
// This can be removed once the backend is fully integrated
export const mockApi = {
  // Mock data and functions (fallback for testing and development)
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      await delay(MOCK_DELAY);
      
      const professor = professors.find(p => p.email === email && p.password === password);
      
      if (!professor) {
        throw new Error('Invalid credentials');
      }
      
      return {
        token: 'mock-jwt-token',
        user: professor
      };
    },
    
    register: async (professorData: Omit<Professor, 'id' | 'role'>): Promise<AuthResponse> => {
      await delay(MOCK_DELAY);
      
      const existingProfessor = professors.find(p => p.email === professorData.email);
      
      if (existingProfessor) {
        throw new Error('Email already in use');
      }
      
      const newProfessor: Professor = {
        ...professorData,
        id: (professors.length + 1).toString(),
        role: 'PROFESSOR'
      };
      
      professors.push(newProfessor);
      
      return {
        token: 'mock-jwt-token',
        user: newProfessor
      };
    }
  },
  
  // Exam functions
  exams: {
    getAll: async (professorId: string): Promise<Exam[]> => {
      await delay(MOCK_DELAY);
      return exams.filter(exam => exam.professorId === professorId);
    },
    
    getById: async (examId: string): Promise<Exam> => {
      await delay(MOCK_DELAY);
      const exam = exams.find(e => e.id === examId);
      
      if (!exam) {
        throw new Error('Exam not found');
      }
      
      return exam;
    },
    
    getByAccessLink: async (accessLink: string): Promise<Exam> => {
      await delay(MOCK_DELAY);
      const exam = exams.find(e => e.accessLink === accessLink);
      
      if (!exam) {
        throw new Error('Exam not found');
      }
      
      return exam;
    },
    
    create: async (examData: Omit<Exam, 'id' | 'createdAt' | 'accessLink'>): Promise<Exam> => {
      await delay(MOCK_DELAY);
      
      const newExam: Exam = {
        ...examData,
        id: (exams.length + 1).toString(),
        createdAt: new Date(),
        accessLink: `exam-${exams.length + 1}-${Math.random().toString(36).substring(2, 8)}`
      };
      
      exams.push(newExam);
      
      return newExam;
    },
    
    update: async (examId: string, examData: Partial<Exam>): Promise<Exam> => {
      await delay(MOCK_DELAY);
      
      const examIndex = exams.findIndex(e => e.id === examId);
      
      if (examIndex === -1) {
        throw new Error('Exam not found');
      }
      
      exams[examIndex] = { ...exams[examIndex], ...examData };
      
      return exams[examIndex];
    },
    
    delete: async (examId: string): Promise<void> => {
      await delay(MOCK_DELAY);
      
      const examIndex = exams.findIndex(e => e.id === examId);
      
      if (examIndex === -1) {
        throw new Error('Exam not found');
      }
      
      exams.splice(examIndex, 1);
    }
  },
  
  // Question functions
  questions: {
    getByExamId: async (examId: string): Promise<Question[]> => {
      await delay(MOCK_DELAY);
      return questions.filter(q => q.examId === examId);
    },
    
    create: async (questionData: Omit<Question, 'id'>): Promise<Question> => {
      await delay(MOCK_DELAY);
      
      const newQuestion: Question = {
        ...questionData,
        id: (questions.length + 1).toString()
      };
      
      questions.push(newQuestion);
      
      return newQuestion;
    },
    
    update: async (questionId: string, questionData: Partial<Question>): Promise<Question> => {
      await delay(MOCK_DELAY);
      
      const questionIndex = questions.findIndex(q => q.id === questionId);
      
      if (questionIndex === -1) {
        throw new Error('Question not found');
      }
      
      questions[questionIndex] = { ...questions[questionIndex], ...questionData };
      
      return questions[questionIndex];
    },
    
    delete: async (questionId: string): Promise<void> => {
      await delay(MOCK_DELAY);
      
      const questionIndex = questions.findIndex(q => q.id === questionId);
      
      if (questionIndex === -1) {
        throw new Error('Question not found');
      }
      
      questions.splice(questionIndex, 1);
    }
  },
  
  // Student functions
  students: {
    register: async (email: string, examId: string): Promise<Student> => {
      await delay(MOCK_DELAY);
      
      let student = students.find(s => s.email === email);
      
      if (!student) {
        student = {
          id: (students.length + 1).toString(),
          email,
          role: 'STUDENT'
        };
        
        students.push(student);
      }
      
      return student;
    }
  },
  
  // Response functions
  responses: {
    submit: async (responseData: Omit<StudentResponse, 'id' | 'isCorrect' | 'submittedAt'>): Promise<StudentResponse> => {
      await delay(MOCK_DELAY);
      
      const question = questions.find(q => q.id === responseData.questionId);
      
      if (!question) {
        throw new Error('Question not found');
      }
      
      const isCorrect = question.correctAnswer.toLowerCase() === responseData.answer.toLowerCase();
      
      const newResponse: StudentResponse = {
        ...responseData,
        id: (studentResponses.length + 1).toString(),
        isCorrect,
        submittedAt: new Date()
      };
      
      studentResponses.push(newResponse);
      
      return newResponse;
    },
    
    getByStudentAndExam: async (studentId: string, examId: string): Promise<StudentResponse[]> => {
      await delay(MOCK_DELAY);
      return studentResponses.filter(r => r.studentId === studentId && r.examId === examId);
    }
  },
  
  // Result functions
  results: {
    calculate: async (studentId: string, examId: string): Promise<ExamResult> => {
      await delay(MOCK_DELAY);
      
      const exam = exams.find(e => e.id === examId);
      
      if (!exam) {
        throw new Error('Exam not found');
      }
      
      const responses = studentResponses.filter(r => r.studentId === studentId && r.examId === examId);
      
      const questionResults = responses.map(response => {
        const question = questions.find(q => q.id === response.questionId);
        
        return {
          questionId: response.questionId,
          isCorrect: response.isCorrect || false,
          studentAnswer: response.answer,
          correctAnswer: question?.correctAnswer || ''
        };
      });
      
      const correctAnswers = questionResults.filter(r => r.isCorrect).length;
      const totalQuestions = exam.questions.length;
      
      const result: ExamResult = {
        id: (examResults.length + 1).toString(),
        studentId,
        examId,
        totalScore: correctAnswers,
        maxScore: totalQuestions,
        percentage: (correctAnswers / totalQuestions) * 100,
        completedAt: new Date(),
        questionResults
      };
      
      examResults.push(result);
      
      return result;
    },
    
    getByStudentAndExam: async (studentId: string, examId: string): Promise<ExamResult | null> => {
      await delay(MOCK_DELAY);
      return examResults.find(r => r.studentId === studentId && r.examId === examId) || null;
    }
  }
};
