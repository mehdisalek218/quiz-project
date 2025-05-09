import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Exam } from "@/types";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Import the spinner icon

interface StudentRegistrationProps {
  exam: Exam;
  onRegister: (email: string) => Promise<void>;
  isLoading?: boolean; // Optional prop
}

export const StudentRegistration = ({ 
  exam, 
  onRegister,
  isLoading: propIsLoading = false // Default to false if not provided
}: StudentRegistrationProps) => {
  const [email, setEmail] = useState("");
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Use either the prop isLoading or internal loading state
  const isLoading = propIsLoading || internalIsLoading;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setInternalIsLoading(true);
    
    try {
      await onRegister(email);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setInternalIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="bg-quiz-primary text-white rounded-t-lg">
        <CardTitle className="text-xl">{exam.name}</CardTitle>
        {exam.description && (
          <CardDescription className="text-gray-200">
            {exam.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">
              Your email will be used to identify your exam responses.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-quiz-secondary hover:bg-quiz-secondary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Exam...
              </>
            ) : (
              "Start Exam"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};