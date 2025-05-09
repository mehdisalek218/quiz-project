
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { Exam, User } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (!storedUser) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    
    if (parsedUser.role !== "PROFESSOR") {
      navigate("/");
      return;
    }
    
    setUser(parsedUser);
    
    const fetchExams = async () => {
      try {
        const examData = await api.exams.getAll(parsedUser.id);
        setExams(examData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exams",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExams();
  }, [navigate, toast]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const handleDeleteExam = async (examId: string) => {
    try {
      await api.exams.delete(examId);
      setExams(exams.filter(exam => exam.id !== examId));
      toast({
        title: "Success",
        description: "Exam deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive",
      });
    }
  };
  
  const filteredExams = exams.filter(exam => 
    exam.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-quiz-primary">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Manage your exams and view student results
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/create-exam">
              <Button className="bg-quiz-primary hover:bg-quiz-primary/90">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Exam
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mb-6">
          <Input
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-primary"></div>
          </div>
        ) : filteredExams.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-quiz-primary text-white rounded-t-lg">
                  <CardTitle className="text-xl">{exam.name}</CardTitle>
                  <CardDescription className="text-gray-200">
                    {exam.questions.length} Questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Access Link</h4>
                      <div className="flex items-center mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 overflow-x-auto">
                          {exam.accessLink}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/exam/${exam.accessLink}`);
                            toast({
                              title: "Link Copied",
                              description: "Exam link copied to clipboard",
                            });
                          }}
                          className="ml-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/edit-exam/${exam.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/view-results/${exam.id}`)}
                      >
                        Results
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id!)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="quiz-card text-center py-8">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Exams Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "No exams match your search." : "You haven't created any exams yet."}
            </p>
            {!searchTerm && (
              <Link to="/create-exam">
                <Button className="bg-quiz-primary hover:bg-quiz-primary/90">
                  Create Your First Exam
                </Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfessorDashboard;
