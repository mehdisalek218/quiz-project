
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ExamCreation from "./pages/ExamCreation";
import ExamTaking from "./pages/ExamTaking";
import ExamResults from "./pages/ExamResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProfessorDashboard />} />
          <Route path="/create-exam" element={<ExamCreation />} />
          <Route path="/edit-exam/:examId" element={<ExamCreation />} />
          <Route path="/exam/:examId" element={<ExamTaking />} />
          <Route path="/exam-results/:examId" element={<ExamResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
