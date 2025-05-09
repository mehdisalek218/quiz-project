import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CheckCircle2, BookOpen, Clock, Award, ChevronDown, ArrowRight } from "lucide-react";

const Index = () => {
  const [examCode, setExamCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleExamAccess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exam code",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/exam/${examCode}`);
  };

  const scrollToStudentSection = () => {
    const studentSection = document.getElementById('student-section');
    if (studentSection) {
      studentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-pattern py-20 px-4">
          <div className="container mx-auto max-w-6xl flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div className="animate-fade-in">
                <span className="inline-block px-3 py-1 bg-quiz-primary/10 text-quiz-primary rounded-full text-sm font-medium mb-4">
                  Smart Exam Platform
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Create and Take Exams with <span className="gradient-text">Ease</span>
                </h1>
                <p className="text-lg mb-8 text-gray-600 max-w-xl">
                  Quiz Wizard is a powerful platform for professors to create online exams and for students to take them seamlessly.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/login">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-quiz-primary hover:bg-quiz-primary/90 shadow-lg shadow-quiz-primary/20"
                    >
                      Teacher Login
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto border-quiz-primary text-quiz-primary hover:bg-quiz-primary/10"
                    onClick={scrollToStudentSection}
                  >
                    Take an Exam
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 animate-slide-in">
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-quiz-secondary/20 rounded-full"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-quiz-primary/10 rounded-full"></div>
                <img
                  src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Student taking an online exam"
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-xl z-10 relative"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-quiz-primary/10 text-quiz-primary rounded-full text-sm font-medium mb-4">
                Benefits
              </span>
              <h2 className="section-title max-w-2xl mx-auto">
                Powerful Features for Educators
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform offers everything you need to create and manage your exams with ease.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="quiz-card text-center p-6 group hover:border-quiz-primary transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-quiz-primary to-quiz-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Exam Creation</h3>
                <p className="text-gray-600">
                  Create exams with multiple types of questions, add images, and set time limits.
                </p>
              </div>
              
              <div className="quiz-card text-center p-6 group hover:border-quiz-primary transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-quiz-primary to-quiz-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Timed Questions</h3>
                <p className="text-gray-600">
                  Set specific time limits for each question to better assess student knowledge.
                </p>
              </div>
              
              <div className="quiz-card text-center p-6 group hover:border-quiz-primary transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-quiz-primary to-quiz-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Automatic Grading</h3>
                <p className="text-gray-600">
                  Responses are automatically graded, saving you time and providing immediate feedback.
                </p>
              </div>
              
              <div className="quiz-card text-center p-6 group hover:border-quiz-primary transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-quiz-primary to-quiz-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">
                  Get comprehensive insights on student performance and exam statistics.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 px-4 bg-gray-100">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-quiz-primary/10 text-quiz-primary rounded-full text-sm font-medium mb-4">
                Process
              </span>
              <h2 className="section-title max-w-2xl mx-auto">
                How Quiz Wizard Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A simple three-step process for both educators and students.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="quiz-card p-8 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-quiz-primary text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Create an Exam</h3>
                <p className="text-gray-600 mb-4">
                  Professors create exams with various question types, set time limits, and customize settings.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <div className="text-sm text-gray-500">For Professors</div>
                  <Link to="/login" className="text-quiz-primary font-medium flex items-center mt-1 hover:underline">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="quiz-card p-8 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-quiz-primary text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Share Access Link</h3>
                <p className="text-gray-600 mb-4">
                  After creating an exam, share the unique exam code with your students.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <div className="text-sm text-gray-500">For Professors</div>
                  <div className="text-quiz-primary font-medium flex items-center mt-1">
                    Simple one-click sharing
                  </div>
                </div>
              </div>
              
              <div className="quiz-card p-8 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-quiz-primary text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Take the Exam</h3>
                <p className="text-gray-600 mb-4">
                  Students enter the exam code, register with their email, and complete the questions.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <div className="text-sm text-gray-500">For Students</div>
                  <button 
                    onClick={scrollToStudentSection}
                    className="text-quiz-primary font-medium flex items-center mt-1 hover:underline"
                  >
                    Enter exam code
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Student Section */}
        <section id="student-section" className="py-20 px-4 bg-quiz-primary text-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Take an Exam?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Enter the exam code provided by your professor to access your exam.
              </p>
            </div>
            
            <form onSubmit={handleExamAccess} className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-quiz-primary text-xl font-semibold mb-4 text-center">
                Access Your Exam
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="examCode" className="block text-gray-700 font-medium mb-1">
                    Exam Code
                  </label>
                  <Input
                    id="examCode"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="Enter exam code"
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-quiz-primary hover:bg-quiz-primary/90"
                >
                  Access Exam
                </Button>
              </div>
            </form>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-quiz-primary/10 text-quiz-primary rounded-full text-sm font-medium mb-4">
                Testimonials
              </span>
              <h2 className="section-title max-w-2xl mx-auto">
                What Educators Are Saying
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from professors who have transformed their assessment process with Quiz Wizard.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="quiz-card">
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Quiz Wizard has revolutionized how I administer exams. The automatic grading saves me hours of work, and my students love the intuitive interface."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-quiz-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-quiz-primary font-semibold">JP</span>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Dr. James Peterson</div>
                    <div className="text-sm text-gray-500">Biology Professor</div>
                  </div>
                </div>
              </div>
              
              <div className="quiz-card">
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The ability to set timed questions has significantly improved how I assess my students' knowledge. The analytics provide valuable insights into areas where students are struggling."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-quiz-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-quiz-primary font-semibold">SM</span>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Sarah Mitchell</div>
                    <div className="text-sm text-gray-500">Mathematics Professor</div>
                  </div>
                </div>
              </div>
              
              <div className="quiz-card">
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Quiz Wizard made remote learning during the pandemic much easier. The platform is reliable, and the support team is responsive to any questions."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-quiz-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-quiz-primary font-semibold">RK</span>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Dr. Robert Kim</div>
                    <div className="text-sm text-gray-500">Computer Science Professor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="about" className="py-20 px-4 bg-gray-100">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-quiz-primary/10 text-quiz-primary rounded-full text-sm font-medium mb-4">
                FAQ
              </span>
              <h2 className="section-title max-w-2xl mx-auto">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about Quiz Wizard.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="quiz-card">
                <h3 className="text-xl font-semibold mb-2">How do I create an exam?</h3>
                <p className="text-gray-600">
                  After logging in as a professor, navigate to the "Create Exam" page. You can add questions, set time limits, and customize other exam settings.
                </p>
              </div>
              
              <div className="quiz-card">
                <h3 className="text-xl font-semibold mb-2">Can students use notes during exams?</h3>
                <p className="text-gray-600">
                  This is entirely up to the professor. Quiz Wizard provides the platform, but professors set the rules for their exams.
                </p>
              </div>
              
              <div className="quiz-card">
                <h3 className="text-xl font-semibold mb-2">How are exams graded?</h3>
                <p className="text-gray-600">
                  Multiple-choice questions are automatically graded. For direct answer questions, the system compares student responses with the correct answer, allowing for minor variations.
                </p>
              </div>
              
              <div className="quiz-card">
                <h3 className="text-xl font-semibold mb-2">Can I edit an exam after creating it?</h3>
                <p className="text-gray-600">
                  Yes, you can edit exams at any time before students begin taking them. Once a student has started an exam, you cannot edit it to maintain fairness.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-quiz-primary/10 text-quiz-primary rounded-full text-sm font-medium mb-4">
                Get in Touch
              </span>
              <h2 className="section-title max-w-2xl mx-auto">
                Contact Us
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="quiz-card p-8">
                <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Your message"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-quiz-secondary"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-quiz-primary hover:bg-quiz-primary/90">
                    Send Message
                  </Button>
                </form>
              </div>
              
              <div className="quiz-card p-8">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-6">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Email</div>
                    <a href="mailto:support@quizwizard.com" className="text-quiz-primary hover:underline">
                      support@quizwizard.com
                    </a>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Phone</div>
                    <a href="tel:+15551234567" className="text-quiz-primary hover:underline">
                      +1 (555) 123-4567
                    </a>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Address</div>
                    <p className="text-gray-600">
                      123 Education Avenue<br />
                      Suite 456<br />
                      Knowledge City, KN 12345
                    </p>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Office Hours</div>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday - Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-quiz-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-quiz-primary font-bold text-lg">Q</span>
                </div>
                <span className="font-bold text-xl">Quiz Wizard</span>
              </div>
              <p className="text-white/80 mb-4">
                Revolutionizing the way educators create and administer exams.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Home</a>
                </li>
                <li>
                  <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
                </li>
                <li>
                  <a href="#student-section" className="text-white/80 hover:text-white transition-colors">Take Exam</a>
                </li>
                <li>
                  <Link to="/login" className="text-white/80 hover:text-white transition-colors">Teacher Login</Link>
                </li>
                <li>
                  <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Exam Creation</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Timed Questions</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Automatic Grading</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Analytics</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Student Reports</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Cookie Policy</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">GDPR Compliance</a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">Accessibility</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/20 text-center">
            <p className="text-white/60">
              © {new Date().getFullYear()} Quiz Wizard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;