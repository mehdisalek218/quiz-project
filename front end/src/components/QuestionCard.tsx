import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question, StudentResponse } from "@/types";
import { useEffect, useState } from "react";
import { Timer } from "./Timer";
import { AlertCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (response: Omit<StudentResponse, "id" | "isCorrect" | "submittedAt">) => void;
  studentId: string;
  examId: string;
  isLastQuestion: boolean;
}

export const QuestionCard = ({
  question,
  onAnswerSubmit,
  studentId,
  examId,
  isLastQuestion,
}: QuestionCardProps) => {
  const [answer, setAnswer] = useState("");
  const [timeExpired, setTimeExpired] = useState(false);
  
  const handleSubmit = () => {
    onAnswerSubmit({
      studentId,
      examId,
      questionId: question?.id || "",
      answer,
    });
    setAnswer("");
  };
  
  useEffect(() => {
    if (timeExpired && !answer) {
      // If time expired and no answer provided, submit an empty answer
      handleSubmit();
    }
  }, [timeExpired]);
  
  // Handle case where question is undefined
  if (!question) {
    return (
      <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in">
        <CardHeader className="bg-red-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <CardTitle className="text-xl">Question non disponible</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p>La question demandée n'existe pas ou n'a pas pu être chargée.</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t p-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-quiz-secondary hover:bg-quiz-secondary/90"
          >
            Rafraîchir
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in">
      <CardHeader className="bg-quiz-primary text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{question.text}</CardTitle>
          <Timer 
            durationSeconds={question.durationSeconds} 
            onTimeExpired={() => setTimeExpired(true)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {question.imageUrl && (
          <div className="mb-6">
            <img
              src={question.imageUrl}
              alt="Question Image"
              className="w-full max-w-md mx-auto rounded-md"
            />
          </div>
        )}
        
        <div className="space-y-4">
          {question.type === "MULTIPLE_CHOICE" ? (
            <RadioGroup value={answer} onValueChange={setAnswer}>
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer w-full">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="answer">Votre réponse</Label>
              <Input
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Tapez votre réponse ici..."
              />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 border-t p-4">
        <Button 
          onClick={handleSubmit} 
          disabled={!answer}
          className="bg-quiz-secondary hover:bg-quiz-secondary/90"
        >
          {isLastQuestion ? "Terminer l'examen" : "Question suivante"}
        </Button>
      </CardFooter>
    </Card>
  );
};
