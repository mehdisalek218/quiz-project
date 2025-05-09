
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { Exam, Question, QuestionType, User } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ExamCreation = () => {
  const { examId } = useParams<{ examId: string }>();
  const isEditMode = !!examId;
  
  const [user, setUser] = useState<User | null>(null);
  const [examName, setExamName] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Current question being edited
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>("MULTIPLE_CHOICE");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [imageData, setImageData] = useState("");
  
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
    
    if (isEditMode) {
      setIsLoading(true);
      
      api.exams.getById(examId)
        .then(exam => {
          setExamName(exam.name);
          setExamDescription(exam.description || "");
          setQuestions(exam.questions);
        })
        .catch(error => {
          toast({
            title: "Error",
            description: "Failed to load exam",
            variant: "destructive",
          });
          navigate("/dashboard");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [examId, isEditMode, navigate, toast]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };
  
  const resetQuestionForm = () => {
    setQuestionText("");
    setQuestionType("MULTIPLE_CHOICE");
    setOptions(["", "", "", ""]);
    setCorrectAnswer("");
    setDurationSeconds(30);
    setImageData("");
    setCurrentQuestionIndex(-1);
  };
  
  const validateQuestion = () => {
    if (!questionText.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return false;
    }
    
    if (questionType === "MULTIPLE_CHOICE") {
      const validOptions = options.filter(option => option.trim());
      
      if (validOptions.length < 2) {
        toast({
          title: "Error",
          description: "At least 2 options are required for multiple choice questions",
          variant: "destructive",
        });
        return false;
      }
      
      if (!correctAnswer) {
        toast({
          title: "Error",
          description: "Please select the correct answer",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (!correctAnswer.trim()) {
        toast({
          title: "Error",
          description: "Correct answer is required",
          variant: "destructive",
        });
        return false;
      }
    }
    
    if (durationSeconds < 5) {
      toast({
        title: "Error",
        description: "Question duration must be at least 5 seconds",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleAddQuestion = () => {
    if (!validateQuestion()) return;
    
    const newQuestion: Question = {
      text: questionText,
      type: questionType,
      options: questionType === "MULTIPLE_CHOICE" ? options.filter(option => option.trim()) : undefined,
      correctAnswer,
      durationSeconds,
      imageData: imageData || undefined,
    };
    
    setQuestions([...questions, newQuestion]);
    resetQuestionForm();
    
    toast({
      title: "Success",
      description: "Question added to exam",
    });
  };
  
  const handleUpdateQuestion = () => {
    if (currentQuestionIndex === -1 || !validateQuestion()) return;
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      text: questionText,
      type: questionType,
      options: questionType === "MULTIPLE_CHOICE" ? options.filter(option => option.trim()) : undefined,
      correctAnswer,
      durationSeconds,
      imageData: imageData || undefined,
    };
    
    setQuestions(updatedQuestions);
    resetQuestionForm();
    
    toast({
      title: "Success",
      description: "Question updated",
    });
  };
  
  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    
    setCurrentQuestionIndex(index);
    setQuestionText(question.text);
    setQuestionType(question.type);
    setOptions(question.options?.length ? [...question.options, ...Array(4 - question.options.length).fill("")] : ["", "", "", ""]);
    setCorrectAnswer(question.correctAnswer);
    setDurationSeconds(question.durationSeconds);
    setImageData(question.imageData || "");
  };
  
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    
    if (currentQuestionIndex === index) {
      resetQuestionForm();
    } else if (currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    
    toast({
      title: "Success",
      description: "Question deleted",
    });
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSaveExam = async () => {
    if (!examName.trim()) {
      toast({
        title: "Error",
        description: "Exam name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "At least one question is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const examData: Exam = {
        name: examName,
        description: examDescription,
        professorId: user?.id!,
        questions,
      };
      
      let savedExam;
      
      if (isEditMode) {
        savedExam = await api.exams.update(examId!, examData);
        toast({
          title: "Success",
          description: "Exam updated successfully",
        });
      } else {
        savedExam = await api.exams.create(examData);
        toast({
          title: "Success",
          description: "Exam created successfully",
        });
      }
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save exam",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-quiz-primary"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-quiz-primary">
            {isEditMode ? "Edit Exam" : "Create New Exam"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Make changes to your existing exam"
              : "Create a new exam with custom questions"}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Exam Details */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-name">Exam Name</Label>
                  <Input
                    id="exam-name"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="e.g., Midterm Exam"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exam-description">Description (Optional)</Label>
                  <Textarea
                    id="exam-description"
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    placeholder="Add a brief description of this exam"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Question Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentQuestionIndex === -1 ? "Add Question" : `Edit Question #${currentQuestionIndex + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question-text">Question Text</Label>
                  <Textarea
                    id="question-text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter your question here"
                    rows={2}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={questionType}
                    onValueChange={(value) => setQuestionType(value as QuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                      <SelectItem value="DIRECT_ANSWER">Direct Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {questionType === "MULTIPLE_CHOICE" ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Options</Label>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                        {options.map((option, index) => (
                          option && (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`option-${index}`} />
                              <Label htmlFor={`option-${index}`}>{option}</Label>
                            </div>
                          )
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="correct-answer">Correct Answer</Label>
                    <Input
                      id="correct-answer"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="Enter the exact correct answer"
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(parseInt(e.target.value))}
                    min={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Question Image (Optional)</Label>
                  <ImageUpload
                    onImageUploaded={(data) => setImageData(data)}
                    existingImageUrl={imageData}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  {currentQuestionIndex !== -1 && (
                    <Button
                      variant="outline"
                      onClick={resetQuestionForm}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={currentQuestionIndex === -1 ? handleAddQuestion : handleUpdateQuestion}
                    className="bg-quiz-secondary hover:bg-quiz-secondary/90"
                  >
                    {currentQuestionIndex === -1 ? "Add Question" : "Update Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle>Exam Questions ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="p-4 border rounded-md hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">
                            {index + 1}. {question.text}
                          </h3>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuestion(index)}
                              className="h-7 w-7 p-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestion(index)}
                              className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {question.type === "MULTIPLE_CHOICE" ? "Multiple Choice" : "Direct Answer"} • {question.durationSeconds}s
                        </p>
                        {question.imageData && (
                          <div className="mt-2">
                            <img src={question.imageData} alt="Question" className="h-16 object-contain rounded" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No questions added yet</p>
                    <p className="text-sm mt-1">Use the form to add questions to your exam</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Save Exam Button */}
            <Button
              className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
              size="lg"
              onClick={handleSaveExam}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>Save Exam</>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamCreation;
