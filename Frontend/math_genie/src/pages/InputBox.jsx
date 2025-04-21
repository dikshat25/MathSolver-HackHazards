import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Mic, PenTool, Sparkles, ImageIcon, RefreshCw, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase setup
const db = getFirestore();
const auth = getAuth();

function MathInputBox() {
  const navigate = useNavigate();

  // Core states
  const [transcription, setTranscription] = useState("");
  const [typedInput, setTypedInput] = useState("");
  const [solution, setSolution] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLatex, setImageLatex] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  // Toasts
  const showError = (msg) => toast.error(msg);
  const showSuccess = (msg) => toast.success(msg);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Check system preference for dark mode on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Navigation
  const handleBackToHome = () => navigate("/");

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImageLatex("");
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image and get LaTeX
  const handleImageUpload = async () => {
    if (!imageFile) return showError("Please select an image first!");
    setImgLoading(true);
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/latex", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data?.latex) {
        setImageLatex(response.data.latex);
        setTypedInput(response.data.latex);
        showSuccess("LaTeX extracted from image!");
      } else {
        showError("No LaTeX detected in the image.");
      }
    } catch (error) {
      console.error(error);
      showError("Failed to extract LaTeX from image.");
    }

    setImgLoading(false);
  };

  // Simulated solve function
  const handleSolveWithAI = async () => {
    if (!typedInput.trim() && !imageLatex.trim()) {
      return showError("Please enter a math problem first!");
    }
    
    setIsProcessing(true);
    
    try {
      // Simulating API call
      setTimeout(() => {
        const inputToUse = typedInput.trim() || imageLatex.trim();
        setSolution(`For the equation ${inputToUse}:\n\n$$x^2 + 5x + 6 = 0$$\n\nWe can factor this as:\n\n$$(x+2)(x+3) = 0$$\n\nSolving for x:\n\n$$x = -2$$ or $$x = -3$$`);
        showSuccess("Problem solved!");
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      showError("Failed to solve the problem. Please try again.");
      setIsProcessing(false);
    }
  };

  // Voice recording handlers
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Simulated transcription
        setTimeout(() => {
          setTranscription("Find the solution for x^2 + 5x + 6 = 0");
          setTypedInput("x^2 + 5x + 6 = 0");
          showSuccess("Speech converted to text!");
          setIsRecording(false);
        }, 1000);
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      showError("Failed to access microphone.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stream cleanup will happen in onstop handler
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const clearAll = () => {
    setTypedInput("");
    setImageFile(null);
    setImagePreview(null);
    setImageLatex("");
    setTranscription("");
    setSolution("");
  };

  // Dynamic classes based on dark mode
  const bgClass = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-purple-50 to-blue-50";
  const headerBgClass = darkMode ? "bg-gradient-to-r from-purple-800 to-blue-900" : "bg-gradient-to-r from-purple-600 to-blue-500";
  const cardBgClass = darkMode ? "bg-gray-800" : "bg-white";
  const inputBgClass = darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200";
  const textClass = darkMode ? "text-gray-200" : "text-gray-700";
  const subtextClass = darkMode ? "text-gray-400" : "text-gray-500";
  const borderClass = darkMode ? "border-gray-700" : "border-gray-200";
  const highlightBorderClass = darkMode ? "border-purple-700" : "border-purple-100";
  const buttonPrimaryClass = darkMode 
    ? "bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800" 
    : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600";
  const buttonSecondaryClass = darkMode 
    ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
    : "border-gray-300 text-gray-600 hover:bg-gray-100";
  const solutionBgClass = darkMode ? "bg-gray-800" : "bg-white";

  return (
    <div className={`w-screen h-screen overflow-y-auto ${bgClass} transition-colors duration-300`}>
      <ToastContainer position="top-center" autoClose={3000} theme={darkMode ? "dark" : "light"} />
      
      <div className="h-full w-full flex flex-col">
        {/* Top Navigation */}
        <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm flex justify-between items-center`}>
          <button 
            onClick={handleBackToHome}
            className={`flex items-center gap-2 ${darkMode ? "text-purple-400 hover:bg-gray-700" : "text-purple-600 hover:bg-purple-50"} px-4 py-2 rounded-lg transition-all duration-200`}
          >
            <ArrowLeft size={16}/> Back
          </button>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-purple-100 text-purple-700"} transition-all duration-200`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Header */}
        <div className={`${headerBgClass} p-6 text-white`}>
          <h3 className="text-2xl font-bold flex items-center">
            <Sparkles className="mr-2" size={24} /> 
            Math Problem Solver
          </h3>
          <p className={`${darkMode ? "text-purple-200" : "text-purple-100"} mt-1`}>Get step-by-step solutions to any math problem</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className={`w-1/2 p-6 overflow-y-auto border-r ${borderClass}`}>
            <div className="space-y-6">
              {/* Input Selector Tabs */}
              <div className={`flex border-b ${borderClass}`}>
                <button className={`px-4 py-2 font-medium ${darkMode ? "text-purple-400 border-purple-500" : "text-purple-600 border-purple-600"} border-b-2`}>Input Methods</button>
              </div>
              
              {/* Voice Input with Improved Toggle */}
              <div className={`${darkMode ? "bg-gradient-to-r from-gray-800 to-gray-700" : "bg-gradient-to-r from-purple-50 to-blue-50"} rounded-2xl p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-medium ${textClass} flex items-center`}>
                    <Mic size={18} className={darkMode ? "text-purple-400 mr-2" : "text-purple-500 mr-2"} />
                    Voice Input
                  </h4>
                  {/* Improved toggle button */}
                  <div 
                    onClick={toggleRecording}
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isRecording ? (darkMode ? "bg-purple-500" : "bg-purple-600") : (darkMode ? "bg-gray-600" : "bg-gray-300")}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isRecording ? "translate-x-7" : "translate-x-0"}`}></div>
                  </div>
                </div>
                <button
                  onClick={toggleRecording}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all duration-300 ${isRecording 
                    ? "bg-red-500 hover:bg-red-600" 
                    : buttonPrimaryClass}`}
                >
                  {isRecording ? (
                    <>
                      <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse mr-1"></span>
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic size={18} />
                      Start Speaking
                    </>
                  )}
                </button>
                {transcription && (
                  <div className={`mt-3 p-3 ${cardBgClass} rounded-lg border ${highlightBorderClass}`}>
                    <p className={subtextClass}>Transcription:</p>
                    <p className={textClass}>{transcription}</p>
                  </div>
                )}
              </div>

              {/* Typed Input */}
              <div className="space-y-3">
                <h4 className={`font-medium ${textClass} flex items-center`}>
                  <PenTool size={18} className={darkMode ? "text-purple-400 mr-2" : "text-purple-500 mr-2"}/>
                  Type your problem
                </h4>
                <textarea
                  rows={3}
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  className={`w-full p-4 border ${borderClass} rounded-xl focus:ring-2 ${darkMode ? "focus:ring-purple-700 focus:border-purple-700 bg-gray-700 text-white" : "focus:ring-purple-300 focus:border-purple-500 bg-white text-gray-700"} transition-all duration-200`}
                  placeholder="E.g., x² + 5x + 6 = 0"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <h4 className={`font-medium ${textClass} flex items-center`}>
                  <ImageIcon size={18} className={darkMode ? "text-purple-400 mr-2" : "text-purple-500 mr-2"}/>
                  Upload a math image
                </h4>
                
                <div className={`border-2 border-dashed ${darkMode ? "border-gray-600 hover:border-purple-500" : "border-gray-200 hover:border-purple-300"} rounded-xl p-4 text-center transition-colors duration-200`}>
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded"/>
                      <button 
                        onClick={() => {setImageFile(null); setImagePreview(null);}}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} className={`${darkMode ? "text-gray-500" : "text-gray-400"} mx-auto mb-2`} />
                      <label className={`cursor-pointer ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"}`}>
                        Browse Files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-sm mt-1`}>or drag and drop</p>
                    </>
                  )}
                </div>
                
                {imageFile && (
                  <button
                    onClick={handleImageUpload}
                    disabled={imgLoading}
                    className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 ${
                      imgLoading 
                        ? `${darkMode ? "bg-gray-600" : "bg-gray-300"} ${darkMode ? "text-gray-400" : "text-gray-500"} cursor-not-allowed` 
                        : buttonPrimaryClass + " text-white"
                    } transition-all duration-200`}
                  >
                    {imgLoading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> Processing Image...
                      </>
                    ) : "Extract Math from Image"}
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSolveWithAI}
                  disabled={isProcessing || (!typedInput.trim() && !imageLatex.trim())}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
                    isProcessing || (!typedInput.trim() && !imageLatex.trim())
                      ? `${darkMode ? "bg-gray-600 text-gray-400" : "bg-gray-300 text-gray-500"} cursor-not-allowed` 
                      : buttonPrimaryClass + " text-white"
                  } transition-all duration-200 shadow-md`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Solving...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18}/> Solve Problem
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearAll}
                  className={`px-4 py-3 border ${buttonSecondaryClass} rounded-xl transition-colors duration-200`}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Solution */}
          <div className={`w-1/2 p-6 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-white"} overflow-y-auto`}>
            <div className="space-y-4">
              <h4 className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"} text-lg flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                Solution
              </h4>
              
              {solution ? (
  <div className={`${solutionBgClass} p-6 rounded-2xl shadow-sm border ${highlightBorderClass}`}>
   {solution.split("\n").map((line, i) => (
  line.startsWith("$$")
    ? <div key={i} className={`my-6 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>
        <BlockMath math={line.replace(/\$\$/g, "")} />
      </div>
    : <p key={i} className={`my-2 ${darkMode ? "text-gray-300" : "text-gray-800"}`}>{line}</p>
))}
  </div>
) : (
  <div className={`${solutionBgClass} p-6 rounded-2xl shadow-sm border ${highlightBorderClass} flex flex-col items-center justify-center min-h-80`}>
    <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-purple-900" : "bg-purple-100"} flex items-center justify-center mb-4`}>
      <Sparkles size={24} className={darkMode ? "text-purple-400" : "text-purple-500"} />
    </div>
    <h5 className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-800"} mb-2`}>Ready to solve your problem</h5>
    <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center`}>Enter a math problem using voice, text, or image and click "Solve Problem"</p>
  </div>
)}
              
              {/* LaTeX from Image */}
              {imageLatex && (
                <div className={`${solutionBgClass} p-5 rounded-xl border ${highlightBorderClass} mt-4`}>
                  <p className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>Extracted LaTeX:</p>
                  <pre className={`${darkMode ? "bg-gray-900 text-purple-300" : "bg-gray-50 text-purple-800"} p-3 rounded-lg whitespace-pre-wrap text-sm overflow-x-auto`}>{imageLatex}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MathInputBox;