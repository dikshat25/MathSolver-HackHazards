import React, { useState, useRef } from "react";
import { ArrowLeft, Mic, PenTool, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { transcribeAudio } from "../api/transcribeAudio";
import { solveWithGroq } from "../api/solveWithGroq";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();


export default function MathInputBox() {
  const navigate = useNavigate();
  const [transcription, setTranscription] = useState("");
  const [typedInput, setTypedInput] = useState("");
  const [solution, setSolution] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleBackToHome = () => navigate("/");

  const handleStartRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(completeBlob);
        try {
          const transcriptionResult = await transcribeAudio(completeBlob);
          setTranscription(transcriptionResult || "No transcription received.");
        } catch (error) {
          console.error("Error transcribing audio:", error);
          setTranscription("Error during transcription.");
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSolveWithGroq = async () => {
    const inputToSend = typedInput || transcription;
    if (!inputToSend.trim()) {
      setSolution("Please type or speak a math problem first.");
      return;
    }
  
    const response = await solveWithGroq(inputToSend);
    setSolution(response);
  
    // Store history in Firestore
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, "mathHistory"), {
          uid: user.uid,
          problem: inputToSend,
          solution: response,
          timestamp: new Date(),
        });
        console.log("Problem and solution saved to Firestore");
      } catch (error) {
        console.error("Error saving history to Firestore:", error);
      }
    }
  };
  

  return (
    <div className="fixed inset-0 overflow-y-auto bg-purple-50 z-10">
      <div className="min-h-screen w-full flex items-center justify-center relative p-4">
        <div className="absolute top-6 left-6">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-purple-600 bg-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-100 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-purple-800 mb-6">Solve Any Math Problem</h3>

            <div className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-2xl p-8 md:p-10 mb-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
              <Mic size={32} className="text-purple-500 mb-3" />
              <button
                onClick={handleStartRecording}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${isRecording ? "bg-purple-500" : ""
                  }`}
              >
                {isRecording ? "Recording..." : "Start Speaking"}
              </button>
              <p className="text-center text-gray-600 mt-2">Click to speak your math problem</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <PenTool size={18} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">Type your math problem</span>
                </div>

                <textarea
                  rows={4}
                  className="w-full p-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800"
                  placeholder="Type your math problem here..."
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                />

                <button
                  onClick={handleSolveWithGroq}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles size={18} />
                  Solve with Groq AI
                </button>
              </div>

              <div className="w-full lg:w-2/3 bg-purple-50 rounded-2xl p-6 min-h-64">
                <p className="text-gray-700 font-semibold">Transcription:</p>
                <p className="text-gray-600 mt-2">{transcription || "Your transcription will appear here."}</p>

                <p className="text-gray-700 font-semibold mt-6">Solution:</p>
                <div className="text-gray-700 mt-2 space-y-2">
                  {solution
                    ? solution.split("\n").map((line, idx) =>
                        line.trim().startsWith("$$") ? (
                          <BlockMath key={idx} math={line.replace(/\$\$/g, "")} />
                        ) : (
                          <p key={idx}>{line}</p>
                        )
                      )
                    : <p>Your solution will appear here.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
