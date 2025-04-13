import { useState, useEffect } from "react";
import { Menu, X, MessageSquare, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ isDarkMode, setShowLoginForm, toggleSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToMathInput = () => {
    navigate('/math-input');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? isDarkMode 
            ? 'bg-gray-900 shadow-lg' 
            : 'bg-white shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className={`${isDarkMode ? 'bg-purple-600' : 'bg-purple-600'} text-white p-2 rounded-lg`}>
                <span className="text-2xl font-bold">∑</span>
              </div>
              <h1 className={`ml-2 text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MathGenie</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks isDarkMode={isDarkMode} />
              
              {/* Chat Button */}
              <button 
                onClick={navigateToMathInput}
                className={`flex items-center gap-1 p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                } transition-colors`}
                aria-label="Math Chat"
              >
                <MessageSquare size={20} />
                <span className="text-sm font-medium">Chat</span>
              </button>
              
              {/* Settings Button */}
              <button 
                onClick={toggleSettings}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } transition-colors`}
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              
              {/* Sign In Button */}
              <button 
                onClick={() => setShowLoginForm(true)}
                className={`${
                  isDarkMode 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium`}
              >
                Sign In
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Chat Button (Mobile) */}
              <button 
                onClick={navigateToMathInput}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-purple-100 text-purple-700'
                }`}
                aria-label="Math Chat"
              >
                <MessageSquare size={20} />
              </button>
              
              {/* Settings Button (Mobile) */}
              <button 
                onClick={toggleSettings}
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={toggleMenu} 
                className={`p-2 rounded-lg ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-gray-700 hover:text-purple-700'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col gap-4">
                <NavLinks 
                  isDarkMode={isDarkMode} 
                  isMobile={true} 
                  closeMenu={() => setIsMenuOpen(false)} 
                />
                <button 
                  onClick={() => {
                    setShowLoginForm(true);
                    setIsMenuOpen(false);
                  }}
                  className={`${
                    isDarkMode 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium`}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
}

function NavLinks({ isDarkMode, isMobile = false, closeMenu }) {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/math-input" },
    { label: "Solution Viewer", href: "/solutions" },
    { label: "Mistake Tracker", href: "/mistakes" },
  ];
  
  return (
    <>
      {navItems.map((item, index) => (
        <a 
          key={index}
          href={item.href}
          onClick={isMobile ? closeMenu : undefined}
          className={`block ${
            isDarkMode 
              ? 'text-gray-300 hover:text-white' 
              : 'text-gray-700 hover:text-purple-700'
          } transition-colors ${isMobile ? 'py-2 text-lg' : 'text-base'}`}
        >
          {item.label}
        </a>
      ))}
    </>
  );
}