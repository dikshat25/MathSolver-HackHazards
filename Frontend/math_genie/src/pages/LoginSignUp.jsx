import { useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed

export default function LoginSignupModal({ isDarkMode, showLoginForm, setShowLoginForm }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });

  if (!showLoginForm) return null;

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        const userCredential = await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        console.log("Logged in:", userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, signupForm.email, signupForm.password);
        const user = userCredential.user;

        // Save name & email to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: signupForm.name,
          email: signupForm.email
        });

        console.log("Signed up and user info saved");
      }

      setShowLoginForm(false);
    } catch (error) {
      console.error("Auth error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl p-6 w-full max-w-md shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
            {isLoginMode ? "Sign In" : "Create Account"}
          </h3>
          <button 
            onClick={() => setShowLoginForm(false)}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Full Name</label>
                <input 
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  className={`w-full p-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300 text-gray-900'}`}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            
            <div>
              <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Email</label>
              <input 
                type="email"
                name="email"
                value={isLoginMode ? loginForm.email : signupForm.email}
                onChange={isLoginMode ? handleLoginChange : handleSignupChange}
                className={`w-full p-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300 text-gray-900'}`}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Password</label>
              <input 
                type="password"
                name="password"
                value={isLoginMode ? loginForm.password : signupForm.password}
                onChange={isLoginMode ? handleLoginChange : handleSignupChange}
                className={`w-full p-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300 text-gray-900'}`}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
            >
              {isLoginMode ? "Sign In" : "Sign Up"}
            </button>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  if (isLoginMode) {
                    setLoginForm({ email: '', password: '' });
                  } else {
                    setSignupForm({ name: '', email: '', password: '' });
                  }
                }}
                className="text-purple-500 hover:text-purple-600 text-sm"
              >
                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
