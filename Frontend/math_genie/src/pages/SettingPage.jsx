import { useState, useEffect } from "react";
import { Save, History, LogOut, User, Settings as SettingsIcon, Trash2, Eye, X, Moon, Sun, Award, Book, Zap, ChevronLeft, ChevronRight, Bookmark, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDoc, getDocs, doc, collection, deleteDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

export default function SettingsPanel({ isDarkMode, toggleTheme, isOpen, onClose }) {
  const [summarizedCards, setSummarizedCards] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileForm, setProfileForm] = useState({
    name: "Loading...",
    email: "Loading...",
    grade: "High School",
    preferredMode: "detailed"
  });

  const [historyItems, setHistoryItems] = useState([]);

  const [viewMode, setViewMode] = useState("list");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSummary, setCurrentSummary] = useState("Tap 'Summarize' to view a flashcard summary");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch user data and history on auth change

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        try {

          const displayNameFromEmail = (email) => {
            if (!email) return "Unnamed";
            const [namePart] = email.split("@");
            return namePart
              .replace(/[\._-]/g, " ")
              .split(" ")
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          };


          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          let fullName = displayNameFromEmail(user.email);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.fullName) {
              fullName = userData.fullName;
            }
          }

          setProfileForm((prev) => ({
            ...prev,
            name: fullName,
            email: user.email || "No email"
          }));


          const historyRef = query(
            collection(db, "mathHistory"),
            where("uid", "==", user.uid)
          ); //  corrected path
          const historySnap = await getDocs(historyRef);

          const items = historySnap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              problem: data.problem || "Untitled Problem",
              solution: data.solution || "No solution provided",
              date: data.date || new Date().toISOString().split("T")[0],
              thumbnail: data.thumbnail || "/api/placeholder/60/60"
            };
          });

          console.log("Fetched history items:", items); // Optional debug log
          setHistoryItems(items);
          const summarizeAll = async () => {
            const summaries = await Promise.all(
              items.map(async (item) => {
                try {
                  const response = await fetch("http://localhost:5000/summarize", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ text: item.solution }),
                  });
                  const data = await response.json();
                  return data.summary || "No summary available.";
                } catch (error) {
                  console.error("Error summarizing:", error);
                  return "Summary failed.";
                }
              })
            );
            setSummarizedCards(summaries);
          };

        } catch (err) {
          console.error("Failed to fetch user or history:", err);
        }
      }
    });


    return () => unsubscribe();
  }, []);

  const summarizeCurrentCard = async () => {
    const item = historyItems[currentCardIndex];
    if (!item || !item.solution) return;
  
    // Don’t refetch if already summarized
    if (summarizedCards[currentCardIndex]) {
      setCurrentSummary(summarizedCards[currentCardIndex]);
      return;
    }
  
    setIsLoadingSummary(true);
    try {
      const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: item.solution }),
      });
  
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const summary = data.summary || "No summary available.";
  
      setSummarizedCards((prev) => ({
        ...prev,
        [currentCardIndex]: summary,
      }));
      setCurrentSummary(summary);
    } catch (error) {
      console.error("Summary failed:", error);
      setCurrentSummary("Summary failed.");
    } finally {
      setIsLoadingSummary(false);
    }
  };  

  const currentCardSummary = summarizedCards[currentCardIndex] || "No summary available";

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleDeleteHistoryItem = async (id) => {
    setHistoryItems(historyItems.filter(item => item.id !== id));

    if (userId) {
      try {
        const ref = doc(db, "mathHistory", userId, id); // assuming nested structure
        await deleteDoc(ref);
        console.log("Deleted from Firestore");
      } catch (error) {
        console.error("Failed to delete history item:", error);
      }
    }
  };

  const handleViewSolution = (id) => {
    navigate(`/solutions/${id}`);
    onClose(); // Close the panel after navigation
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      navigate("/");
      onClose(); // Close the panel after logout
      // Optionally, you might want to show a success message using toast here
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to logout. Please try again."); // Or use a toast for error
    }
  };


  // Flashcard navigation functions
  const goToNextCard = () => {
    if (currentCardIndex < historyItems.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setCurrentSummary("Tap 'Summarize' to view a flashcard summary");
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setCurrentSummary("Tap 'Summarize' to view a flashcard summary");
    }
  };

  const toggleCardFlip = async () => {
    const nextFlip = !isFlipped;
    console.log("Flipping card. Current index:", currentCardIndex);
    console.log("Flipping to back side?", nextFlip);
    setIsFlipped(nextFlip);
  
    if (nextFlip && historyItems[currentCardIndex]) {
      console.log("Fetching summary for:", historyItems[currentCardIndex].problem);
  
      setCurrentSummary("Loading...");
      setIsLoadingSummary(true);
  
      try {
        const response = await fetch("http://localhost:5000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: historyItems[currentCardIndex].solution }),
        });
  
        console.log("API request sent. Waiting for response...");
  
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
        const data = await response.json();
        console.log("Received API response:", data);
  
        const summary = data.summary || "No summary available.";
        setCurrentSummary(summary);
        console.log("Set summary state to:", summary);
      } catch (error) {
        console.error("Failed to summarize:", error);
        setCurrentSummary("Summary failed.");
      } finally {
        setIsLoadingSummary(false);
        console.log("Finished summary fetch. isLoadingSummary:", false);
      }
    } else {
      console.log("Not flipping to back or no history item found.");
    }
  };
  

  // If the panel is not open, don't render anything
  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Settings Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md transform transition-transform duration-300 ease-in-out z-50 pointer-events-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-xl overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-100'} border-b`}>
            <div className="flex items-center">
              <SettingsIcon className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h2>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full mr-2 ${isDarkMode ? 'bg-gray-600 text-yellow-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-500'}`}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex border-b px-4 ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
            <button
              className={`py-4 px-6 font-medium flex items-center justify-center rounded-t-lg transition-colors ${activeTab === 'profile'
                  ? (isDarkMode ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-700' : 'text-purple-700 border-b-2 border-purple-700 bg-white')
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900')
                }`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} className="mr-2" />
              Profile
            </button>
            <div className="w-4"></div> {/* Spacer between tabs */}
            <button
              className={`py-4 px-6 font-medium flex items-center justify-center rounded-t-lg transition-colors ${activeTab === 'history'
                  ? (isDarkMode ? 'text-purple-400 border-b-2 border-purple-400 bg-gray-700' : 'text-purple-700 border-b-2 border-purple-700 bg-white')
                  : (isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900')
                }`}
              onClick={() => setActiveTab('history')}
            >
              <History size={18} className="mr-2" />
              History
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} flex items-center`}>
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-purple-100'} mr-4`}>
                    <User size={32} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User Profile</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage your account settings</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'} shadow-sm`}>
                  <div className="space-y-5">
                    <div>
                      <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                      <div className={`relative ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg ${isDarkMode
                              ? 'bg-gray-600 border-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400'
                              : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            } transition-colors`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>@</div>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg ${isDarkMode
                              ? 'bg-gray-600 border-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400'
                              : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            } transition-colors`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Education Level</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Book size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <select
                          name="grade"
                          value={profileForm.grade}
                          onChange={handleProfileChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg appearance-none ${isDarkMode
                              ? 'bg-gray-600 border-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400'
                              : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            } transition-colors`}
                        >
                          <option value="Elementary">Elementary School</option>
                          <option value="Middle">Middle School</option>
                          <option value="High School">High School</option>
                          <option value="College">College</option>
                          <option value="Graduate">Graduate School</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-2 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Preferred Explanation Mode</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Zap size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <select
                          name="preferredMode"
                          value={profileForm.preferredMode}
                          onChange={handleProfileChange}
                          className={`w-full pl-10 pr-3 py-2 rounded-lg appearance-none ${isDarkMode
                              ? 'bg-gray-600 border-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400'
                              : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                            } transition-colors`}
                        >
                          <option value="eli5">ELI5 (Simplified)</option>
                          <option value="detailed">Detailed</option>
                          <option value="advanced">Advanced</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 
                        ${isDarkMode
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                        } transition-colors shadow-sm font-medium`}
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} flex items-center justify-between`}>
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-purple-100'} mr-4`}>
                      <History size={32} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Solved Problems History</h2>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Review your past solutions</p>
                    </div>
                  </div>

                  {/* View mode toggle - Enhanced with better spacing and styling */}
                  {historyItems.length > 0 && (
                    <div className={`flex rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} p-1`}>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === "list"
                            ? (isDarkMode ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-600 text-white shadow-sm')
                            : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-500' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300')
                          }`}
                      >
                        List
                      </button>
                      <div className="mx-0.5"></div> {/* Space between buttons */}
                      <button
                        onClick={() => {
                          setViewMode("flashcard");
                          setCurrentCardIndex(0);
                          setIsFlipped(false);
                        }}
                        className={`px-4 py-2 text-sm font-small rounded-md transition-all duration-200 ${viewMode === "flashcard"
                            ? (isDarkMode ? 'bg-purple-600 text-white shadow-sm' : 'bg-purple-600 text-white shadow-sm')
                            : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-500' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300')
                          }`}
                      >
                        Card
                      </button>
                    </div>
                  )}
                </div>

                {historyItems.length === 0 ? (
                  <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'} rounded-lg shadow-sm`}>
                    <Award size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>No history found</p>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start solving math problems!</p>
                  </div>
                ) : viewMode === "list" ? (
                  // List View
                  <div className="space-y-4">
                    {historyItems.map(item => (
                      <div
                        key={item.id}
                        className={`
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-white hover:bg-gray-50 border border-gray-200'} 
                          p-4 rounded-lg flex items-center justify-between transition-colors shadow-sm
                        `}
                      >
                        <div className="flex items-center truncate">
                          <img src={item.thumbnail} alt="Problem thumbnail" className="w-12 h-12 rounded-lg mr-4 object-cover" />
                          <div className="truncate">
                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.problem}</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2 shrink-0">
                          <button
                            onClick={() => handleViewSolution(item.id)}
                            className={`p-2 rounded-lg ${isDarkMode
                                ? 'bg-gray-600 hover:bg-purple-600 text-gray-300 hover:text-white'
                                : 'bg-purple-50 hover:bg-purple-100 text-purple-600'
                              } transition-colors`}
                            title="View Solution"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            className={`p-2 rounded-lg ${isDarkMode
                                ? 'bg-gray-600 hover:bg-red-600 text-gray-300 hover:text-white'
                                : 'bg-red-50 hover:bg-red-100 text-red-600'
                              } transition-colors`}
                            title="Delete from History"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Flashcard View
                  <div className="flex flex-col items-center">
                    {/* Flashcard - Enhanced with better styling */}
                    <div
                      className={`w-full aspect-[4/3] perspective-1000 my-4 cursor-pointer`}
                      onClick={toggleCardFlip}
                  
                    >
                      <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front of card (Problem) */}
                        <div
                          className={`absolute inset-0 rounded-xl p-6 flex flex-col justify-between backface-hidden ${isDarkMode
                              ? 'bg-gray-700 border border-gray-600'
                              : 'bg-white border-2 border-purple-100'
                            } shadow-lg`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDarkMode
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-purple-50 text-purple-700'
                              }`}>
                              <Clock size={14} className="inline mr-1" />
                              {historyItems[currentCardIndex].date}
                            </span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Card {currentCardIndex + 1} of {historyItems.length}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center justify-center">
                            <img
                              src={historyItems[currentCardIndex].thumbnail}
                              alt="Problem visual"
                              className="w-20 h-20 rounded-lg mb-5 object-cover shadow-md"
                            />
                            <h3 className={`text-lg font-medium text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {historyItems[currentCardIndex].problem}
                            </h3>
                          </div>

                          <p className={`text-center text-sm mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} animate-pulse`}>
                            Tap to see solution
                          </p>
                        </div>

                        {/* Back of card (Solution) */}
                        <div
                          className={`absolute inset-0 rounded-xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 ${isDarkMode
                              ? 'bg-gray-700 border border-gray-600'
                              : 'bg-white border-2 border-purple-100'
                            } shadow-lg`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDarkMode
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-purple-50 text-purple-700'
                              }`}>
                              <Bookmark size={14} className="inline mr-1" />
                              Solution
                            </span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Card {currentCardIndex + 1} of {historyItems.length}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                            <pre className={`text-lg font-mono whitespace-pre-wrap text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {isLoadingSummary ? "Loading..." : currentSummary}
                            </pre>

                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewSolution(historyItems[currentCardIndex].id);
                              }}
                              className={`text-sm px-4 py-2 rounded-lg ${isDarkMode
                                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                                } transition-colors shadow-sm`}
                            >
                              <Eye size={14} className="inline mr-1" />
                              View Full Solution
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation controls - Enhanced styling */}
                    <div className="flex items-center justify-between w-full mt-6">
                      <button
                        onClick={goToPrevCard}
                        disabled={currentCardIndex === 0}
                        className={`p-3 rounded-full transition-all duration-200 ${currentCardIndex === 0
                            ? (isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                            : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-purple-50 hover:bg-purple-100 text-purple-600')
                          }`}
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button
                        onClick={toggleCardFlip}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isDarkMode
                            ? 'bg-gray-600 hover:bg-gray-500 text-white'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          }`}
                      >
                        {isFlipped ? 'Show Problem' : 'Show Solution'}
                      </button>

                      <button
                        onClick={goToNextCard}
                        disabled={currentCardIndex === historyItems.length - 1}
                        className={`p-3 rounded-full transition-all duration-200 ${currentCardIndex === historyItems.length - 1
                            ? (isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed')
                            : (isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-purple-50 hover:bg-purple-100 text-purple-600')
                          }`}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full mt-4 mb-2">
                      <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                        <div
                          className="h-full bg-purple-600 transition-all duration-300"
                          style={{ width: `${((currentCardIndex + 1) / historyItems.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>



                    {/* Delete button */}
                    <div className="w-full mt-4">
                      <button
                        onClick={() => handleDeleteHistoryItem(historyItems[currentCardIndex].id)}
                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isDarkMode
                            ? 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white border border-gray-600'
                            : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100'
                          }`}
                      >
                        <Trash2 size={16} />
                        Delete This Card
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 ${isDarkMode ? 'border-t border-gray-700 bg-gray-750' : 'border-t border-gray-200 bg-gray-50'}`}>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}