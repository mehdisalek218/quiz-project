import { QuestionCard } from "@/components/QuestionCard";
import { StudentRegistration } from "@/components/StudentRegistration";
import { api } from "@/services/api";
import { Exam, Student, StudentResponse } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";

const ExamTaking = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [examCompleted, setExamCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const examData = await api.exams.getByAccessLink(examId!);
        
        // Vérifier si l'examen a des questions
        if (!examData.questions || examData.questions.length === 0) {
          setError("Cet examen ne contient aucune question.");
          setExam(null);
        } else {
          setExam(examData);
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement de l'examen:", error);
        setError(error.message || "Examen introuvable ou non disponible");
        toast({
          title: "Erreur",
          description: "Examen introuvable ou non disponible",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (examId) {
      fetchExam();
    }
  }, [examId, navigate, toast]);
  
  const handleStudentRegistration = async (email: string) => {
    try {
      setIsLoading(true);
      const studentData = await api.students.register(email, exam!.id!);
      setStudent(studentData);
      setIsLoading(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Échec de l'inscription à l'examen",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const handleAnswerSubmit = async (response: Omit<StudentResponse, "id" | "isCorrect" | "submittedAt">) => {
    try {
      const savedResponse = await api.responses.submit(response);
      setResponses([...responses, savedResponse]);
      
      if (currentQuestionIndex === exam!.questions.length - 1) {
        // Dernière question, calculer les résultats
        await calculateResults();
      } else {
        // Passer à la question suivante
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Échec de la soumission de la réponse",
        variant: "destructive",
      });
    }
  };
  
  const calculateResults = async () => {
    try {
      await api.results.calculate(student!.id!, exam!.id!);
      setExamCompleted(true);
      navigate(`/exam-results/${exam!.id}?studentId=${student!.id}`);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Échec du calcul des résultats",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !exam) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Examen non disponible</h1>
            <p className="text-gray-600 mb-4">
              {error || "L'examen que vous recherchez n'existe pas ou a expiré."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-quiz-secondary hover:underline"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <StudentRegistration exam={exam} onRegister={handleStudentRegistration} />
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-quiz-primary">{exam.name}</h1>
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} sur {exam.questions.length}
            </p>
            <p className="text-gray-600">
              Étudiant: {student.email}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-quiz-secondary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / exam.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <QuestionCard
          question={exam.questions[currentQuestionIndex]}
          onAnswerSubmit={handleAnswerSubmit}
          studentId={student.id!}
          examId={exam.id!}
          isLastQuestion={currentQuestionIndex === exam.questions.length - 1}
        />
      </main>
    </div>
  );
};

export default ExamTaking;
