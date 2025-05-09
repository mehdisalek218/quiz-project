
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { api } from "@/services/api";
import { ExamResult, Student } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ExamResults = () => {
  const { examId } = useParams<{ examId: string }>();
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  
  const [result, setResult] = useState<ExamResult | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!examId || !studentId) return;
      
      try {
        setIsLoading(true);
        
        // In a real app, we would fetch the student details
        const storedStudent = localStorage.getItem('studentData');
        if (storedStudent) {
          setStudent(JSON.parse(storedStudent));
        } else {
          // Mock student data
          setStudent({
            id: studentId,
            email: 'student@example.com',
            role: 'STUDENT'
          });
        }
        
        const examResult = await api.results.getByStudentAndExam(studentId, examId);
        
        if (!examResult) {
          toast({
            title: "Error",
            description: "Results not found",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        
        setResult(examResult);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load results",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [examId, navigate, studentId, toast]);
  
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
  
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-quiz-primary mb-2">Results Not Found</h1>
            <p className="text-gray-600 mb-4">The exam results you're looking for don't exist.</p>
            <button
              onClick={() => navigate("/")}
              className="text-quiz-secondary hover:underline"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const getScoreColorClass = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-quiz-primary">Exam Results</h1>
          <p className="text-gray-600 mt-1">
            {student?.email}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 overflow-hidden">
            <CardHeader className="bg-quiz-primary text-white">
              <CardTitle>Score Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-2 inline-flex items-end">
                  <span className={getScoreColorClass(result.percentage)}>
                    {Math.round(result.percentage)}%
                  </span>
                </div>
                <p className="text-gray-600">
                  {result.totalScore} out of {result.maxScore} correct
                </p>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div
                  className={`h-4 rounded-full ${
                    result.percentage >= 80
                      ? "bg-green-500"
                      : result.percentage >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${result.percentage}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500 mb-1">
                    {result.questionResults.filter(q => q.isCorrect).length}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500 mb-1">
                    {result.questionResults.filter(q => !q.isCorrect).length}
                  </div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500 mb-1">
                    {result.maxScore}
                  </div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-bold mb-4 text-quiz-primary">Question Details</h2>
          
          <div className="space-y-4">
            {result.questionResults.map((qResult, index) => (
              <Card key={index} className={qResult.isCorrect ? "border-green-200" : "border-red-200"}>
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      qResult.isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {qResult.isCorrect ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">Question {index + 1}</h3>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Your Answer:</p>
                          <p className={qResult.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            {qResult.studentAnswer || "(No answer)"}
                          </p>
                        </div>
                        
                        {!qResult.isCorrect && (
                          <div>
                            <p className="text-gray-500">Correct Answer:</p>
                            <p className="text-green-600 font-medium">
                              {qResult.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-quiz-primary hover:bg-quiz-primary/90"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamResults;
