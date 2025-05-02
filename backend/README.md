
# Quiz Wizard Backend

This is a simple Spring Boot backend for the Quiz Wizard application using H2 database.

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven

### Running the Application
1. Navigate to the `backend` directory
2. Run `mvn spring-boot:run`
3. The application will start on port 8080

### H2 Console
- Access the H2 database console at: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:quizdb
- Username: sa
- Password: password

## API Endpoints

### Professor Endpoints
- POST /api/professors/login - Login as a professor
- POST /api/professors/register - Register a new professor

### Exam Endpoints
- GET /api/exams?professorId={id} - Get all exams for a professor
- GET /api/exams/{id} - Get exam by ID
- GET /api/exams/access/{accessLink} - Get exam by access link
- POST /api/exams - Create a new exam
- PUT /api/exams/{id} - Update an exam
- DELETE /api/exams/{id} - Delete an exam

## Sample Data
The application is initialized with sample data:
- Professor: prof@example.com / password123
- Exam: Introduction to Biology (access link: biology101)
- Questions:
  - "What is the powerhouse of the cell?" (Multiple choice)
  - "What is the chemical symbol for water?" (Direct answer)
