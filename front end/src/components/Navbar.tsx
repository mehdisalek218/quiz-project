import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { User } from "@/types";

interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

export const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-quiz-primary to-quiz-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="font-bold text-xl">Quiz Wizard</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`font-medium ${isActive('/') ? 'text-quiz-primary' : 'text-gray-600 hover:text-quiz-primary'} transition-colors`}
            >
              Home
            </Link>
            {user?.role === 'PROFESSOR' && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium ${isActive('/dashboard') ? 'text-quiz-primary' : 'text-gray-600 hover:text-quiz-primary'} transition-colors`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-exam" 
                  className={`font-medium ${isActive('/create-exam') ? 'text-quiz-primary' : 'text-gray-600 hover:text-quiz-primary'} transition-colors`}
                >
                  Create Exam
                </Link>
              </>
            )}
            <a href="#about" className="font-medium text-gray-600 hover:text-quiz-primary transition-colors">
              About
            </a>
            <a href="#contact" className="font-medium text-gray-600 hover:text-quiz-primary transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="block text-gray-500">Signed in as</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={onLogout}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-quiz-primary hover:bg-quiz-primary/90">Login</Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link 
              to="/" 
              className={`block py-2 px-3 rounded-lg ${isActive('/') ? 'bg-quiz-primary/10 text-quiz-primary' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={closeMenu}
            >
              Home
            </Link>
            {user?.role === 'PROFESSOR' && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block py-2 px-3 rounded-lg ${isActive('/dashboard') ? 'bg-quiz-primary/10 text-quiz-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create-exam" 
                  className={`block py-2 px-3 rounded-lg ${isActive('/create-exam') ? 'bg-quiz-primary/10 text-quiz-primary' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={closeMenu}
                >
                  Create Exam
                </Link>
              </>
            )}
            <a 
              href="#about" 
              className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={closeMenu}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="block py-2 px-3 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={closeMenu}
            >
              Contact
            </a>
            
            {user ? (
              <div className="pt-2 border-t">
                <div className="px-3 py-2 text-sm text-gray-600">
                  Signed in as <span className="font-medium">{user.email}</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => {
                    closeMenu();
                    onLogout && onLogout();
                  }}
                  className="ml-3 border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t">
                <Link to="/login" onClick={closeMenu}>
                  <Button className="ml-3 bg-quiz-primary hover:bg-quiz-primary/90">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};