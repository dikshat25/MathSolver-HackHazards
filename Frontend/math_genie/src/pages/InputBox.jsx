import { ArrowLeft, Upload, Mic, PenTool, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"; // For React Router
// or
// import { useRouter } from 'next/navigation'; // For Next.js

export default function MathInputBox() {
  // For React Router
  const navigate = useNavigate();
  const handleBackToHome = () => {
    
    navigate('/');
  
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-purple-50 z-10">
      <div className="min-h-screen w-full flex items-center justify-center relative p-4">
        {/* Back button with navigation */}
        <div className="absolute top-6 left-6">
          <button 
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-purple-600 bg-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-100 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="font-medium"></span>
          </button>
        </div>
        
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-purple-800 mb-6">Solve Any Math Problem</h3>
            
            <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-2xl p-8 md:p-10 mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
              <Upload size={32} className="text-purple-500 mb-3" />
              <p className="text-center text-gray-600">Drag & drop or click here to upload an image or PDF</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Mic size={18} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">Record your question</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <PenTool size={18} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">Type your math problem</span>
                </div>
                
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                  <Sparkles size={18} />
                  Solve with Groq AI
                </button>
              </div>
              
              <div className="w-full lg:w-2/3 bg-purple-50 rounded-2xl p-6 flex items-center justify-center min-h-64">
                <p className="text-center text-gray-500">Your solution will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}