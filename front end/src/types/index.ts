
export interface User {
  id?: string;
  email: string;
  name?: string;
  role: 'PROFESSOR' | 'STUDENT';
}

export interface Professor extends User {
  role: 'PROFESSOR';
  password: string;
}

export interface Student extends User {
  role: 'STUDENT';
}

export type QuestionType = 'MULTIPLE_CHOICE' | 'DIRECT_ANSWER';

export interface Question {
  id?: string;
  text: string;
  imageUrl?: string;
  imageData?: string; // Base64 encoded image
  type: QuestionType;
  options?: string[]; // For multiple choice
  correctAnswer: string;
  durationSeconds: number;
  examId?: string;
}

export interface Exam {
  id?: string;
  name: string;
  description?: string;
  professorId: string;
  questions: Question[];
  accessLink?: string;
  createdAt?: Date;
}

export interface StudentResponse {
  id?: string;
  studentId: string;
  examId: string;
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  submittedAt?: Date;
}

export interface ExamResult {
  id?: string;
  studentId: string;
  examId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  completedAt: Date;
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    studentAnswer: string;
    correctAnswer: string;
  }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
