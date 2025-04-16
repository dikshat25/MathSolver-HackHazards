import { useState } from "react";
import { Brain, Award, Zap, Star, Trophy, Clock, ArrowRight } from "lucide-react";
import {Link} from "react-router-dom" ;

export default function BrainZoneGameSection({ isDarkMode }) {
  const [selectedCategory, setSelectedCategory] = useState("popular");
  
  // Sample game data
  const mathGames = {
    popular: [
      { id: 1, title: "Math Blitz", difficulty: "Medium", players: "2.3k", img: "/api/placeholder/150/150", description: "Solve equations at lightning speed!" },
      { id: 2, title: "Geometry Dash", difficulty: "Hard", players: "1.8k", img: "/api/placeholder/150/150", description: "Master shapes and spatial puzzles" },
      { id: 3, title: "Number Crush", difficulty: "Easy", players: "3.4k", img: "/api/placeholder/150/150", description: "Match numbers to solve problems" },
      { id: 10, title: "Fraction Fun", difficulty: "Medium", players: "1.5k", img: "/api/placeholder/150/150", description: "Master fractions through fun puzzles" },
      { id: 13, title: "Guess the Graph", difficulty: "Medium", players: "1.2k", img: "/api/placeholder/150/150", description: "Identify functions from their graphs", link: "/games/guess-the-graph" },
      { id: 14, title: "Math Escape Room", difficulty: "Hard", players: "2.1k", img: "/api/placeholder/150/150", description: "Solve puzzles to escape the math labyrinth", link: "/games/math-escape-room" }
    ],
    challenges: [
      { id: 4, title: "Weekly Challenge", difficulty: "Variable", players: "956", img: "/api/placeholder/150/150", description: "New problems every week" },
      { id: 5, title: "Speed Math", difficulty: "Medium", players: "1.2k", img: "/api/placeholder/150/150", description: "Race against the clock!" },
      { id: 6, title: "Brain Teaser", difficulty: "Expert", players: "621", img: "/api/placeholder/150/150", description: "Stretch your logical thinking" },
      { id: 11, title: "Math Marathon", difficulty: "Hard", players: "789", img: "/api/placeholder/150/150", description: "Test your endurance with math problems" }
    ],
    tournaments: [
      { id: 7, title: "Math Olympics", difficulty: "All Levels", players: "3.2k", img: "/api/placeholder/150/150", description: "Compete for the top spot!" },
      { id: 8, title: "Algebra Cup", difficulty: "Hard", players: "842", img: "/api/placeholder/150/150", description: "Master of equations tournament" },
      { id: 9, title: "Calculus League", difficulty: "Expert", players: "437", img: "/api/placeholder/150/150", description: "Advanced math competition" },
      { id: 12, title: "Geometry Masters", difficulty: "Medium", players: "912", img: "/api/placeholder/150/150", description: "Showcase your spatial skills" }
    ]
  };
  
  // Daily challenge data
  const dailyChallenge = {
    title: "Algebraic Patterns",
    difficulty: "Medium",
    timeLimit: "10 minutes",
    xpReward: 250,
    completionRate: 64
  };
  
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "text-green-500";
      case "Medium": return "text-yellow-500";
      case "Hard": return "text-orange-500";
      case "Expert": return "text-red-500";
      default: return "text-purple-500";
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-purple-50'} py-16 w-screen min-w-full`}>
      {/* Background Math Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap justify-around items-center">
        {["+", "÷", "×", "−", "=", "π", "∫", "∑", "√"].map((symbol, index) => (
          <span key={index} className="text-6xl font-bold transform rotate-12">{symbol}</span>
        ))}
      </div>
      
      <div className="w-full px-4 mx-auto">
        <div className="flex items-center justify-between mb-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`${isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'} p-2 rounded-lg`}>
              <Brain size={28} className={isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} />
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
              Brain Zone
            </h2>
          </div>
          <button className={`${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors`}>
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Daily Challenge Banner - Full Width */}
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} rounded-2xl p-6 mb-12 shadow-lg text-white w-full max-w-7xl mx-auto`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="md:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={20} className="text-yellow-300" />
                <h3 className="font-bold text-lg">Daily Challenge</h3>
              </div>
              <h2 className="text-2xl font-bold mb-3">{dailyChallenge.title}</h2>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-300" />
                  <span>{dailyChallenge.difficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-yellow-300" />
                  <span>{dailyChallenge.timeLimit}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} className="text-yellow-300" />
                  <span>{dailyChallenge.xpReward} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-300" />
                  <span>{dailyChallenge.completionRate}% completion rate</span>
                </div>
              </div>
              <button className="bg-white text-purple-700 hover:bg-purple-50 px-5 py-2 rounded-lg font-medium transition-colors">
                Start Challenge
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-indigo-300 bg-opacity-30 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <Trophy size={40} className="text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Category Selection */}
        <div className="flex flex-wrap gap-2 mb-6 max-w-7xl mx-auto">
          {[
            { id: "popular", label: "Popular Games", icon: <Star size={16} /> },
            { id: "challenges", label: "Challenges", icon: <Zap size={16} /> },
            { id: "tournaments", label: "Tournaments", icon: <Trophy size={16} /> },
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id 
                  ? isDarkMode 
                    ? 'bg-indigo-700 text-white' 
                    : 'bg-indigo-600 text-white'
                  : isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </div>
        
        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {mathGames[selectedCategory].map((game) => (
            <div 
              key={game.id} 
              className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-purple-100'} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full`}
            >
              <div className="relative">
                <img 
                  src={game.img} 
                  alt={game.title} 
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-0 right-0 m-2 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1 shadow-md`}>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  {game.players} playing
                </div>
              </div>
              
              <div className="p-4">
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
                  {game.title}
                </h3>
                <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {game.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty}
                  </span>
                  <Link to={game.link || "#"}>
                    <button className={`${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg px-4 py-2 font-medium transition-colors`}>
                        Play Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}