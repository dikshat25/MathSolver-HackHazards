import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import LoginSignupModal from "./LoginSignUp";
import MathBackground from "../component/MathBg";
import useThemeToggle from "../component/ThemeToggle";
import MathInputBox from "./InputBox";

// Feature Card Component
function FeatureCard({ title, description, icon, isDarkMode }) {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border`}>
      <div className={`flex items-center justify-center h-16 w-16 ${isDarkMode ? 'bg-gray-700' : 'bg-purple-100'} rounded-full mb-4 mx-auto`}>
        {icon}
      </div>
      <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2 text-center`}>{title}</h3>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>{description}</p>
    </div>
  );
}

// Step Card Component
function StepCard({ number, title, description, isDarkMode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">
        {number}
      </div>
      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2`}>{title}</h3>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center`}>{description}</p>
    </div>
  );
}

// Typing Effect Component
function TypingWelcome({ isDarkMode }) {
  const [text, setText] = useState("");
  const fullText = "Welcome to MathGenie..! Your personal AI Math Tutor";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setText(text + fullText[index]);
        setIndex(index + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [index, text, fullText]);

  return (
    <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
      {text}
      <span className="animate-pulse">|</span>
    </h2>
  );
}

export default function HomePage() {
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate(); // For navigation
  
  const navigateToMathInput = () => {
    navigate('/math-input'); // Navigate to the math input page
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-indigo-950 text-white' : 'bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-900'} relative overflow-hidden transition-colors duration-300`}>
      {/* Animated Math Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <MathBackground isDarkMode={isDarkMode} />
      </div>
      
      {/* Navigation */}
      <Navbar 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        setShowLoginForm={setShowLoginForm}
      />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <TypingWelcome isDarkMode={isDarkMode} />
          <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
            Get instant homework help from your on-demand AI math solver powered by Groq
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={navigateToMathInput}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try Now <ArrowRight size={20} />
            </button>
            <button className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700' : 'bg-white hover:bg-gray-100 text-purple-800 border-purple-200'} px-6 py-3 rounded-xl border flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300`}>
              Learn More
            </button>
          </div>
        </div>
        
        <div className="md:w-1/2">
          {/* Replace with a suitable image */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'} p-6 rounded-2xl shadow-2xl border overflow-hidden`}>
            <img 
              src="https://cdn.mathful.com/web-cdn/homework/public/banana/images/index/instantly.png" 
              alt="Math Solver Preview" 
              className="rounded-xl w-full h-auto object-cover"
            />
            <div className="mt-4 text-center">
              <button 
                onClick={navigateToMathInput}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 mx-auto"
              >
                <Sparkles size={20} />
                Try Math Solver Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Description */}
      <div className={`${isDarkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-white bg-opacity-80'} py-16`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-8`}>Explore MathSolver</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} p-6 rounded-xl shadow-md`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2`}>Home Page</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Welcome screen with introduction, login/signup options and a quick overview of our features.</p>
            </div> */}
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} p-6 rounded-xl shadow-md`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2`}>Dashboard</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Student's main view with voice/image/text input box for submitting math problems.</p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} p-6 rounded-xl shadow-md`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2`}>Solution Viewer</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Displays step-by-step solutions with a toggle for ELI5 (Explain Like I'm 5) mode.</p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} p-6 rounded-xl shadow-md`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2`}>Mistake Tracker</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Shows user's weak topics & past performance to focus on improvement areas.</p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'} p-6 rounded-xl shadow-md md:col-span-2 lg:col-span-1`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-2`}>Settings/Profile</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>User preferences, modes (basic/advanced), and theme switcher customization.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className={`py-16`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-12`}>Why Choose Our Math Solver?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Step-by-Step Solutions"
              description="Get detailed explanations for every problem, helping you understand the concepts better."
              icon={<div className="text-3xl">📊</div>}
              isDarkMode={isDarkMode}
            />
            <FeatureCard 
              title="ELI5 Mode"
              description="Toggle between beginner and expert explanations based on your understanding level."
              icon={<div className="text-3xl">🔄</div>}
              isDarkMode={isDarkMode}
            />
            <FeatureCard 
              title="Mistake Tracker"
              description="Identify your weak areas and track your progress over time."
              icon={<div className="text-3xl">📈</div>}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div id="how-it-works" className="container mx-auto px-4 py-16">
        <h2 className={`text-2xl md:text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-purple-900'} mb-12`}>How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StepCard 
            number="1"
            title="Upload"
            description="Take a photo of your math problem or type it in."
            isDarkMode={isDarkMode}
          />
          <StepCard 
            number="2"
            title="Process"
            description="Our Groq-powered AI analyzes your problem instantly."
            isDarkMode={isDarkMode}
          />
          <StepCard 
            number="3"
            title="Learn"
            description="Get step-by-step solutions with clear explanations."
            isDarkMode={isDarkMode}
          />
          <StepCard 
            number="4"
            title="Improve"
            description="Track your progress and focus on weak areas."
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Ready to Master Math?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">Join thousands of students who are improving their math skills with our AI-powered tutor.</p>
          <button 
            onClick={navigateToMathInput}
            className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Now
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
      
      {/* Login Modal */}
      <LoginSignupModal 
        isDarkMode={isDarkMode} 
        showLoginForm={showLoginForm} 
        setShowLoginForm={setShowLoginForm} 
      />
    </div>
  );
}