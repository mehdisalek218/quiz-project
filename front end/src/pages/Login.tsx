import { ProfessorAuth } from "@/components/ProfessorAuth";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  
  const handleAuthSuccess = (token: string) => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 grid md:grid-cols-2 p-4">
        <div className="hidden md:flex flex-col justify-center items-center bg-quiz-primary rounded-l-2xl p-8 text-white">
          <div className="max-w-md">
            <BookOpen className="h-16 w-16 mb-8" />
            <h2 className="text-3xl font-bold mb-4">Welcome to Quiz Wizard</h2>
            <p className="text-white/80 mb-8">
              Sign in to create and manage your exams. Our platform makes it easy to assess your students' knowledge and track their progress.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold mb-1">100+</div>
                <div className="text-sm text-white/80">Question Types</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold mb-1">25k+</div>
                <div className="text-sm text-white/80">Exams Created</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold mb-1">99.9%</div>
                <div className="text-sm text-white/80">Uptime</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-2xl font-bold mb-1">5k+</div>
                <div className="text-sm text-white/80">Professors</div>
              </div>
            </div>
            <div className="text-white/80 text-sm">
              "Quiz Wizard has transformed how I assess my students. The intuitive interface and powerful features make exam creation a breeze."
              <div className="mt-2 font-medium">— Dr. Amanda Rodriguez, Biology Professor</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center bg-white rounded-2xl md:rounded-l-none md:rounded-r-2xl p-8 shadow-xl">
          <ProfessorAuth onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Login;
