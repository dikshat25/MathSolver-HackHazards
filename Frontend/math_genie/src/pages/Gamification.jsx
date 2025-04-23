import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import useThemeToggle from "../component/ThemeToggle";
import LoginSignupModal from "./LoginSignUp";
import Gamification from "./BrainZone";
import MathBackground from "../component/MathBg";
import SettingsPanel from "./SettingPage";
import { Brain, Lightbulb, Star, Zap, Trophy, ArrowUp } from "lucide-react";

export default function BrainZonePage() {
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState(null);
  
  useEffect(() => {
    setPageLoaded(true);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Floating game elements that appear randomly
  const FloatingGameElements = () => {
    const elements = [
      { icon: <Brain size={24} />, color: "text-indigo-500" },
      { icon: <Star size={24} />, color: "text-yellow-500" },
      { icon: <Lightbulb size={24} />, color: "text-green-500" },
      { icon: <Zap size={24} />, color: "text-orange-500" },
      { icon: <Trophy size={24} />, color: "text-purple-500" },
      { content: "2+2=4", color: "text-blue-500" },
      { content: "x²", color: "text-red-500" },
      { content: "÷", color: "text-green-500" },
      { content: "π", color: "text-indigo-500" },
      { content: "∑", color: "text-purple-500" },
    ];
    
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {elements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.color} opacity-60 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          >
            {element.icon || (
              <span className="text-2xl font-bold">{element.content}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Game milestone achievements popup
  const GameAchievement = ({ show, onClose }) => {
    if (!show) return null;
    
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed bottom-10 right-10 ${isDarkMode ? 'bg-indigo-900' : 'bg-white'} rounded-lg shadow-2xl p-4 z-50 max-w-xs`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 p-3 rounded-full">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>Achievement Unlocked!</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Math Explorer: Solved 5 problems</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </motion.div>
    );
  };

  // Game celebrations animations
  const triggerAnimation = (type) => {
    setActiveAnimation(type);
    setTimeout(() => setActiveAnimation(null), 3000);
  };

  const renderGameAnimation = () => {
    if (!activeAnimation) return null;
    
    switch (activeAnimation) {
      case 'confetti':
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-indigo-500 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB'][Math.floor(Math.random() * 5)],
                  animationDuration: `${1 + Math.random() * 3}s`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        );
      case 'stars':
        return (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse-fade"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              >
                <Star size={24} className="text-yellow-400" />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen w-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-indigo-950 text-white' : 'bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-900'} relative overflow-hidden transition-colors duration-500 ease-in-out`}>
      {/* Enhanced Animated Math Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <MathBackground isDarkMode={isDarkMode} />
      </div>
      
      {/* Game-Related Floating Elements */}
      <FloatingGameElements />
      
      {/* Navigation */}
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        setShowLoginForm={setShowLoginForm}
        toggleSettings={toggleSettings}
      />
      
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      {/* Game Celebration Animations */}
      {renderGameAnimation()}
      
      {/* Achievement Popup */}
      <GameAchievement 
        show={false} // Set to true to show achievement popup
        onClose={() => {}} 
      />
      
      {/* Header with enhanced animations */}
      <div className={`w-full px-4 pt-24 pb-12 transition-all duration-1000 transform ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto relative">
          {/* Decorative accent elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <h1 className={`text-4xl md:text-6xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-purple-900'} relative z-10`}>
            Brain Zone
            <span className="inline-block ml-3 transform animate-bounce-slow">
              <Brain size={isDarkMode ? 40 : 48} className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            </span>
          </h1>
          
          <div className="flex justify-center mt-4">
            <div className="h-2 w-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mt-2 mb-6"></div>
          </div>
          
          <p className={`text-center text-xl max-w-3xl mx-auto mt-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Sharpen your math skills with fun and challenging games designed to make learning enjoyable and effective.
            <span className="block mt-2 font-medium text-indigo-500">Play, Learn, and Level Up Your Math Skills!</span>
          </p>
          
          {/* Game Demo Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
            {[
              { icon: <Zap size={24} />, label: "Games", value: "24+", color: "from-yellow-500 to-orange-500" },
              { icon: <Star size={24} />, label: "Players", value: "5.2k+", color: "from-blue-500 to-indigo-500" },
              { icon: <Trophy size={24} />, label: "Challenges", value: "48", color: "from-green-500 to-emerald-500" },
              { icon: <Lightbulb size={24} />, label: "Skills", value: "12", color: "from-purple-500 to-pink-500" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-4 text-center transition-transform transform hover:scale-105`}
              >
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Interactive Game Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button 
              onClick={() => triggerAnimation('confetti')}
              className={`${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2`}
            >
              <Zap size={20} /> Try Confetti Effect
            </button>
            
            <button 
              onClick={() => triggerAnimation('stars')}
              className={`${isDarkMode ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'} text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2`}
            >
              <Star size={20} /> Try Stars Effect
            </button>
          </div>
        </div>
      </div>
      
      {/* Improved Gamification Component with staggered animation entrance */}
      <div className={`w-full transition-all duration-1000 delay-300 transform ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <Gamification isDarkMode={isDarkMode} />
      </div>
      
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
      
      {/* Login Modal */}
      <LoginSignupModal
        isDarkMode={isDarkMode}
        sowLoginForm={showLoginForm}
        setShowLoginForm={setShowLoginForm}
      />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-40 transition-all transform hover:scale-110 ${
            isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-500'
          } text-white`}
        >
          <ArrowUp size={20} />
        </button>
      )}
      
      {/* Add custom animations to CSS */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(10px, -15px) rotate(5deg); }
          66% { transform: translate(-5px, 10px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        
        @keyframes pulse-fade {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
        
        .animate-pulse-fade {
          animation: pulse-fade 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}