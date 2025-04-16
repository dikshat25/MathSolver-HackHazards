import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { AlertCircle, Award, ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";

// Register required chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const GraphGuessingGame = () => {
  // More comprehensive set of functions organized by difficulty level
  const levelFunctions = [
    // Level 1 - Easy linear and simple functions
    [
      { name: "y = x + 2", func: function(x) { return x + 2; } },
      { name: "y = 2x", func: function(x) { return 2 * x; } },
      { name: "y = x² + 1", func: function(x) { return x * x + 1; } },
      { name: "y = |x|", func: function(x) { return Math.abs(x); } },
      { name: "y = sin(x)", func: function(x) { return Math.sin(x); } },
      { name: "y = x - 1", func: function(x) { return x - 1; } },
      { name: "y = -x", func: function(x) { return -x; } },
      { name: "y = √x", func: function(x) { return x < 0 ? null : Math.sqrt(x); } },
      { name: "y = 3", func: function(x) { return 3; } },
      { name: "y = -x²", func: function(x) { return -x * x; } }
    ],
    // Level 2 - Quadratics and basic trig
    [
      { name: "y = x² - 4", func: function(x) { return x * x - 4; } },
      { name: "y = (x - 2)²", func: function(x) { return (x - 2) * (x - 2); } },
      { name: "y = cos(x)", func: function(x) { return Math.cos(x); } },
      { name: "y = x² + 2x + 1", func: function(x) { return x * x + 2 * x + 1; } },
      { name: "y = x³", func: function(x) { return x * x * x; } },
      { name: "y = sin(2x)", func: function(x) { return Math.sin(2 * x); } },
      { name: "y = |x - 2|", func: function(x) { return Math.abs(x - 2); } },
      { name: "y = 1/x", func: function(x) { return x === 0 ? null : 1 / x; } },
      { name: "y = -x² + 4", func: function(x) { return -x * x + 4; } },
      { name: "y = x² - x", func: function(x) { return x * x - x; } }
    ],
    // Level 3 - More complex functions
    [
      { name: "y = x³ - 3x", func: function(x) { return x * x * x - 3 * x; } },
      { name: "y = sin(x) + cos(x)", func: function(x) { return Math.sin(x) + Math.cos(x); } },
      { name: "y = e^x", func: function(x) { return Math.exp(x); } },
      { name: "y = ln(x+1)", func: function(x) { return x <= -1 ? null : Math.log(x + 1); } },
      { name: "y = x⁴", func: function(x) { return x * x * x * x; } },
      { name: "y = tan(x)", func: function(x) { return Math.tan(x); } },
      { name: "y = sin²(x)", func: function(x) { return Math.sin(x) * Math.sin(x); } },
      { name: "y = 1/(x²+1)", func: function(x) { return 1 / (x * x + 1); } },
      { name: "y = x²·sin(x)", func: function(x) { return x * x * Math.sin(x); } },
      { name: "y = √(|x|)", func: function(x) { return Math.sqrt(Math.abs(x)); } }
    ],
    // Level 4 - Exponentials and logs
    [
      { name: "y = 2^x", func: function(x) { return Math.pow(2, x); } },
      { name: "y = log₂(x+2)", func: function(x) { return x <= -2 ? null : Math.log2(x + 2); } },
      { name: "y = e^(-x²)", func: function(x) { return Math.exp(-x * x); } },
      { name: "y = sinh(x)", func: function(x) { return (Math.exp(x) - Math.exp(-x)) / 2; } },
      { name: "y = cosh(x)", func: function(x) { return (Math.exp(x) + Math.exp(-x)) / 2; } },
      { name: "y = log(x²+1)", func: function(x) { return Math.log(x * x + 1); } },
      { name: "y = 3^x - 2^x", func: function(x) { return Math.pow(3, x) - Math.pow(2, x); } },
      { name: "y = e^x - e^(-x)", func: function(x) { return Math.exp(x) - Math.exp(-x); } },
      { name: "y = ln(cos(x)+2)", func: function(x) { return Math.log(Math.cos(x) + 2); } },
      { name: "y = x·ln(x)", func: function(x) { return x <= 0 ? null : x * Math.log(x); } }
    ],
    // Level 5 - Rational functions
    [
      { name: "y = x/(x²+1)", func: function(x) { return x / (x * x + 1); } },
      { name: "y = (x²-1)/(x-1)", func: function(x) { return x === 1 ? null : (x * x - 1) / (x - 1); } },
      { name: "y = sin(x)/x", func: function(x) { return x === 0 ? 1 : Math.sin(x) / x; } },
      { name: "y = (x³-1)/(x-1)", func: function(x) { return x === 1 ? 3 : (x * x * x - 1) / (x - 1); } },
      { name: "y = x²/(x²-4)", func: function(x) { return (x === 2 || x === -2) ? null : x * x / (x * x - 4); } },
      { name: "y = (x⁴-1)/(x²-1)", func: function(x) { return (x === 1 || x === -1) ? null : (x * x * x * x - 1) / (x * x - 1); } },
      { name: "y = 1/(sin(x)+2)", func: function(x) { return 1 / (Math.sin(x) + 2); } },
      { name: "y = (e^x-1)/x", func: function(x) { return x === 0 ? 1 : (Math.exp(x) - 1) / x; } },
      { name: "y = tan(x)/x", func: function(x) { return x === 0 ? 1 : Math.tan(x) / x; } },
      { name: "y = ln(x)/x", func: function(x) { return x <= 0 ? null : Math.log(x) / x; } }
    ],
    // Level 6 - Challenging combinations
    [
      { name: "y = sin(x²)", func: function(x) { return Math.sin(x * x); } },
      { name: "y = cos(e^x)", func: function(x) { return Math.cos(Math.exp(x)); } },
      { name: "y = ln(sin(x)+1.1)", func: function(x) { return Math.log(Math.sin(x) + 1.1); } },
      { name: "y = sin(ln(x+1))", func: function(x) { return x <= -1 ? null : Math.sin(Math.log(x + 1)); } },
      { name: "y = x·sin(1/x)", func: function(x) { return x === 0 ? null : x * Math.sin(1 / x); } },
      { name: "y = e^(sin(x))", func: function(x) { return Math.exp(Math.sin(x)); } },
      { name: "y = √(1-sin²(x))", func: function(x) { return Math.sqrt(1 - Math.sin(x) * Math.sin(x)); } },
      { name: "y = cos(x)·sin(2x)", func: function(x) { return Math.cos(x) * Math.sin(2 * x); } },
      { name: "y = |sin(x)|+|cos(x)|", func: function(x) { return Math.abs(Math.sin(x)) + Math.abs(Math.cos(x)); } },
      { name: "y = ln(x²+1)·sin(x)", func: function(x) { return Math.log(x * x + 1) * Math.sin(x); } }
    ],
    // Level 7 - Advanced combinations
    [
      { name: "y = sin(x)·cos(x)·tan(x)", func: function(x) { return Math.sin(x) * Math.cos(x) * Math.tan(x); } },
      { name: "y = (sin(x))^(cos(x))", func: function(x) { return Math.pow(Math.abs(Math.sin(x)), Math.cos(x)); } },
      { name: "y = x·sin(1/x²)", func: function(x) { return x === 0 ? null : x * Math.sin(1 / (x * x)); } },
      { name: "y = sin(x+sin(x))", func: function(x) { return Math.sin(x + Math.sin(x)); } },
      { name: "y = ln(1+e^x)", func: function(x) { return Math.log(1 + Math.exp(x)); } },
      { name: "y = e^x·sin(e^x)", func: function(x) { return Math.exp(x) * Math.sin(Math.exp(x)); } },
      { name: "y = cos(x)/(1+x²)", func: function(x) { return Math.cos(x) / (1 + x * x); } },
      { name: "y = sin(π·sin(x))", func: function(x) { return Math.sin(Math.PI * Math.sin(x)); } },
      { name: "y = (e^x-e^(-x))/2", func: function(x) { return (Math.exp(x) - Math.exp(-x)) / 2; } },
      { name: "y = sin(x)·e^(-x²/10)", func: function(x) { return Math.sin(x) * Math.exp(-x * x / 10); } }
    ],
    // Level 8 - Complex periodic
    [
      { name: "y = sin(x) + sin(2x)/2", func: function(x) { return Math.sin(x) + Math.sin(2 * x) / 2; } },
      { name: "y = sin(x) + sin(3x)/3", func: function(x) { return Math.sin(x) + Math.sin(3 * x) / 3; } },
      { name: "y = sin(x)·cos(3x)", func: function(x) { return Math.sin(x) * Math.cos(3 * x); } },
      { name: "y = sin(2x)·cos(5x)", func: function(x) { return Math.sin(2 * x) * Math.cos(5 * x); } },
      { name: "y = sin(x) + sin(5x)/5", func: function(x) { return Math.sin(x) + Math.sin(5 * x) / 5; } },
      { name: "y = cos(x)·cos(2x)·cos(3x)", func: function(x) { return Math.cos(x) * Math.cos(2 * x) * Math.cos(3 * x); } },
      { name: "y = sin²(x) - cos²(x)", func: function(x) { return Math.sin(x) * Math.sin(x) - Math.cos(x) * Math.cos(x); } },
      { name: "y = sin(x) + sin(7x)/7", func: function(x) { return Math.sin(x) + Math.sin(7 * x) / 7; } },
      { name: "y = sin(π·x)·cos(2π·x)", func: function(x) { return Math.sin(Math.PI * x) * Math.cos(2 * Math.PI * x); } },
      { name: "y = sin(x)·sin(2x)·sin(3x)", func: function(x) { return Math.sin(x) * Math.sin(2 * x) * Math.sin(3 * x); } }
    ],
    // Level 9 - Piecewise and absolute value
    [
      { name: "y = sin(x)·|sin(x)|", func: function(x) { return Math.sin(x) * Math.abs(Math.sin(x)); } },
      { name: "y = |sin(x)|·sign(sin(x))", func: function(x) { return Math.abs(Math.sin(x)) * Math.sign(Math.sin(x)); } },
      { name: "y = |x·sin(x)|", func: function(x) { return Math.abs(x * Math.sin(x)); } },
      { name: "y = |sin(x)|+|cos(x)|", func: function(x) { return Math.abs(Math.sin(x)) + Math.abs(Math.cos(x)); } },
      { name: "y = max(sin(x),cos(x))", func: function(x) { return Math.max(Math.sin(x), Math.cos(x)); } },
      { name: "y = min(sin(x),x²)", func: function(x) { return Math.min(Math.sin(x), x * x); } },
      { name: "y = |sin(x)|·|cos(x)|", func: function(x) { return Math.abs(Math.sin(x)) * Math.abs(Math.cos(x)); } },
      { name: "y = |e^x-1|", func: function(x) { return Math.abs(Math.exp(x) - 1); } },
      { name: "y = |sin(πx)|", func: function(x) { return Math.abs(Math.sin(Math.PI * x)); } },
      { name: "y = max(0,sin(x))", func: function(x) { return Math.max(0, Math.sin(x)); } }
    ],
    // Level 10 - Master level
    [
      { name: "y = sin(1/x)·x", func: function(x) { return x === 0 ? null : Math.sin(1 / x) * x; } },
      { name: "y = sin(ln(|x|+0.1))", func: function(x) { return Math.sin(Math.log(Math.abs(x) + 0.1)); } },
      { name: "y = sin(x²)·cos(x³)", func: function(x) { return Math.sin(x * x) * Math.cos(x * x * x); } },
      { name: "y = sin(e^x)·e^(-x)", func: function(x) { return Math.sin(Math.exp(x)) * Math.exp(-x); } },
      { name: "y = sin(x+sin(2x))", func: function(x) { return Math.sin(x + Math.sin(2 * x)); } },
      { name: "y = ln(2+sin(e^x))", func: function(x) { return Math.log(2 + Math.sin(Math.exp(x))); } },
      { name: "y = (sin(x))/(1+x⁴)", func: function(x) { return Math.sin(x) / (1 + x * x * x * x); } },
      { name: "y = cos(π·cos(πx))", func: function(x) { return Math.cos(Math.PI * Math.cos(Math.PI * x)); } },
      { name: "y = sin(√|x|)·sign(x)", func: function(x) { return Math.sin(Math.sqrt(Math.abs(x))) * Math.sign(x); } },
      { name: "y = e^(-x²)·cos(5x)", func: function(x) { return Math.exp(-x * x) * Math.cos(5 * x); } }
    ]
  ];

  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [options, setOptions] = useState([]);
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [statistics, setStatistics] = useState({
    correct: 0,
    incorrect: 0,
    totalTime: 0,
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [xRange, setXRange] = useState([-5, 5]);

  // Game difficulty settings by level
  const difficultySettings = {
    timeLimit: [30, 30, 25, 25, 20, 20, 15, 15, 10, 10],
    pointsPerQuestion: [10, 15, 20, 25, 30, 35, 40, 45, 50, 60],
    numOptions: [3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
  };

  // Motivational messages
  const motivationalMessages = [
    "Great job! You've got a good eye for patterns!",
    "Amazing work! You're a mathematical genius!",
    "Phenomenal! You're mastering these functions!",
    "Incredible! Your pattern recognition skills are top-notch!",
    "Outstanding! You're flying through these challenges!",
    "Excellent! You have a keen mathematical mind!",
    "Brilliant! You're a natural at this!",
    "Fantastic! Your intuition for functions is impressive!",
    "Superb! You're making this look easy!",
    "Magnificent! You have a gift for visualization!"
  ];

  // Get random motivational message
  const getRandomMotivation = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  // Handle user guess
  const handleGuess = (guess) => {
    setUserGuess(guess);
    setIsTimerRunning(false);
    
    const isCorrect = guess === selectedFunction.name;
    
    if (isCorrect) {
      const pointsEarned = difficultySettings.pointsPerQuestion[currentLevel - 1] + Math.floor(timeLeft * 0.5);
      setScore(score + pointsEarned);
      setFeedback(`Correct! +${pointsEarned} points! ${getRandomMotivation()}`);
      setStreakCount(streakCount + 1);
      setStatistics(prev => ({
        ...prev,
        correct: prev.correct + 1,
        totalTime: prev.totalTime + (30 - timeLeft)
      }));
    } else {
      setFeedback(`Incorrect! The correct answer was: ${selectedFunction.name}`);
      setStreakCount(0);
      setStatistics(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        totalTime: prev.totalTime + (30 - timeLeft)
      }));
    }
    
    setShowNextButton(true);
    setShowExplanation(true);
  };

  // Get next question
  const getNextQuestion = () => {
    // Get functions for current level
    const availableFunctions = [...levelFunctions[currentLevel - 1]];
    
    // Randomly select one function
    const randomIndex = Math.floor(Math.random() * availableFunctions.length);
    const chosenFunction = availableFunctions[randomIndex];
    
    // Create options - include the correct answer and some random ones
    const numOptions = difficultySettings.numOptions[currentLevel - 1];
    let optionsArray = [chosenFunction];
    
    // Add random incorrect options
    while (optionsArray.length < numOptions) {
      const randomLevelIndex = Math.floor(Math.random() * levelFunctions.length);
      const randomFunctionIndex = Math.floor(Math.random() * levelFunctions[randomLevelIndex].length);
      const option = levelFunctions[randomLevelIndex][randomFunctionIndex];
      
      // Ensure no duplicates
      if (!optionsArray.some(item => item.name === option.name)) {
        optionsArray.push(option);
      }
    }
    
    // Shuffle options
    optionsArray = optionsArray.sort(() => 0.5 - Math.random());
    
    // Determine appropriate x-range based on level
    let newXRange = [-5, 5]; // Default
    
    if (currentLevel >= 8) {
      newXRange = [-3, 3]; // More zoomed in for complex functions
    } else if (currentLevel >= 5) {
      newXRange = [-4, 4]; // Intermediate zoom
    }
    
    setXRange(newXRange);
    setSelectedFunction(chosenFunction);
    setOptions(optionsArray);
    setFeedback("");
    setShowNextButton(false);
    setShowExplanation(false);
    setTimeLeft(difficultySettings.timeLimit[currentLevel - 1]);
    setIsTimerRunning(true);
  };

  // Handle next question button click
  const handleNextQuestion = () => {
    if (questionIndex < 9) {
      setQuestionIndex(questionIndex + 1);
      getNextQuestion();
    } else {
      // Level complete
      if (currentLevel < 10) {
        setShowLevelComplete(true);
      } else {
        // Game complete
        setGameComplete(true);
      }
    }
  };

  // Start next level
  const startNextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setQuestionIndex(0);
    setShowLevelComplete(false);
    getNextQuestion();
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    getNextQuestion();
  };

  // Restart the game
  const restartGame = () => {
    setCurrentLevel(1);
    setQuestionIndex(0);
    setScore(0);
    setStreakCount(0);
    setStatistics({
      correct: 0,
      incorrect: 0,
      totalTime: 0,
    });
    setGameComplete(false);
    setShowLevelComplete(false);
    getNextQuestion();
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      // Time's up - count as incorrect
      setFeedback(`Time's up! The correct answer was: ${selectedFunction.name}`);
      setStreakCount(0);
      setStatistics(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        totalTime: prev.totalTime + 30
      }));
      setShowNextButton(true);
      setShowExplanation(true);
      setIsTimerRunning(false);
    }
    
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerRunning]);

  // Effect to get next question when level changes
  useEffect(() => {
    if (gameStarted) {
      getNextQuestion();
    }
  }, [currentLevel]);

  // Generate chart data from the selected function
  const generateChartData = (func) => {
    if (!func) return null;
    
    // Create x values within the range
    const [xMin, xMax] = xRange;
    const numPoints = 200;
    const xValues = Array.from({ length: numPoints }, (_, i) => 
      xMin + (i * (xMax - xMin) / (numPoints - 1))
    );
    
    // Calculate y values, handling potential discontinuities
    const dataPoints = [];
    
    for (let i = 0; i < xValues.length; i++) {
      const x = xValues[i];
      const y = func.func(x);
      
      // Skip null values (discontinuities) and very large values
      if (y !== null && Math.abs(y) < 100) {
        dataPoints.push({ x, y });
      }
    }
    
    return {
      datasets: [
        {
          label: "Function",
          data: dataPoints,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderWidth: 3,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        },
      ],
    };
  };

  // Chart options with improved styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'x',
          color: '#333',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#666',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        }
      },
      y: {
        type: 'linear',
        position: 'center',
        title: {
          display: true,
          text: 'y',
          color: '#333',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#666',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    animation: {
      duration: 1000
    }
  };

  const chartData = selectedFunction ? generateChartData(selectedFunction) : null;

  // Calculate progress percentage for level
  const levelProgress = ((questionIndex) / 10) * 100;
  
  // Calculate accuracy percentage
  const accuracy = statistics.correct + statistics.incorrect > 0 
    ? Math.round((statistics.correct / (statistics.correct + statistics.incorrect)) * 100) 
    : 0;

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {/* Welcome Screen */}
      {!gameStarted && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="max-w-2xl bg-gray-800 rounded-xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">Mathplotix</h1>
            <h2 className="text-2xl font-semibold mb-8">Function Guessing Challenge</h2>
            
            {showInstructions ? (
              <>
                <div className="mb-8 text-left">
                  <h3 className="text-xl font-semibold mb-4 text-center">How to Play</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-cyan-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-1">1</span> 
                      <span>You'll be shown the graph of a mathematical function.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-cyan-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-1">2</span> 
                      <span>Select the correct formula that matches the graph within the time limit.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-cyan-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-1">3</span> 
                      <span>Complete 10 questions to advance to the next level.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-cyan-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-1">4</span> 
                      <span>There are 10 levels with increasing difficulty.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-cyan-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-1">5</span> 
                      <span>Score more points by answering quickly!</span>
                    </li>
                  </ul>
                </div>
                <button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                  Start Game
                </button>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-lg">Loading game assets...</p>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                    <div className="bg-cyan-500 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <button 
                  onClick={startGame} 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 animate-pulse"
                >
                  Start Game
                </button>
              </>
            )}
          </div>
        </div>
      )}

{gameStarted && !showLevelComplete && !gameComplete && (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Mathplotix</h1>
              <p className="text-gray-400">Level {currentLevel}: Question {questionIndex + 1}/10</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-lg font-semibold">Score</p>
                <p className="text-2xl font-bold text-cyan-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Streak</p>
                <p className="text-2xl font-bold text-yellow-400">{streakCount}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Time</p>
                <p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                  {timeLeft}s
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
          </div>

          {/* Graph */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
            <div className="h-80 w-full">
              {chartData && (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showNextButton && handleGuess(option.name)}
                className={`p-4 rounded-lg text-lg font-medium transition-all ${
                  showNextButton
                    ? option.name === selectedFunction.name
                      ? 'bg-green-600 hover:bg-green-700'
                      : option.name === userGuess
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-700 hover:bg-cyan-700 hover:scale-105'
                }`}
                disabled={showNextButton}
              >
                {option.name}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg mb-6 ${feedback.startsWith('Correct') 
              ? 'bg-green-900/50 border border-green-500' 
              : 'bg-red-900/50 border border-red-500'}`}>
              <div className="flex items-center">
                {feedback.startsWith('Correct') 
                  ? <Award className="mr-2 text-green-400" size={24} /> 
                  : <AlertTriangle className="mr-2 text-red-400" size={24} />}
                <p className="text-lg">{feedback}</p>
              </div>
            </div>
          )}

          {/* Explanation panel */}
          {showExplanation && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-cyan-400">Function Analysis</h3>
              <p className="mb-4">
                The graph shows {selectedFunction.name}, which has these characteristics:
              </p>
              {/* Customize explanation based on the current function */}
              <ul className="space-y-2 mb-4">
                {selectedFunction.name.includes('sin') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This is a sine function, which is periodic and oscillates between values.</span>
                  </li>
                )}
                {selectedFunction.name.includes('cos') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This is a cosine function, with a period of 2π and oscillates between values.</span>
                  </li>
                )}
                {selectedFunction.name.includes('x²') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This is a quadratic function, creating a parabolic shape.</span>
                  </li>
                )}
                {selectedFunction.name.includes('x³') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This is a cubic function, which has an S-like shape.</span>
                  </li>
                )}
                {selectedFunction.name.includes('e^') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This is an exponential function, which grows rapidly for positive x.</span>
                  </li>
                )}
                {selectedFunction.name.includes('ln') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This is a logarithmic function, which grows slowly for positive x.</span>
                  </li>
                )}
                {selectedFunction.name.includes('|') && (
                  <li className="flex items-start">
                    <ChevronRight className="text-cyan-400 mt-1 mr-1 flex-shrink-0" size={16} />
                    <span>This includes absolute value, which reflects negative values to positive.</span>
                  </li>
                )}
              </ul>
              <div className="flex justify-center">
                <TrendingUp className="text-cyan-400 mr-2" size={20} />
                <p className="text-gray-300 italic">Look for key features like intercepts, symmetry, and behavior at extremes!</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showNextButton && (
            <div className="flex justify-center">
              <button 
                onClick={handleNextQuestion} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      )}

      {/* Level Complete Screen */}
      {showLevelComplete && (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="max-w-2xl bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">Level {currentLevel} Complete!</h2>
            <p className="text-xl mb-6">You've earned {score} points so far.</p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-lg font-semibold mb-2">Accuracy</p>
                <p className="text-3xl font-bold text-yellow-400">{accuracy}%</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-lg font-semibold mb-2">Max Streak</p>
                <p className="text-3xl font-bold text-yellow-400">{streakCount}</p>
              </div>
            </div>
            
            <p className="mb-8 text-lg">Ready to take on level {currentLevel + 1}? The challenges will get more difficult!</p>
            
            <button 
              onClick={startNextLevel} 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              Start Level {currentLevel + 1}
            </button>
          </div>
        </div>
      )}

      {/* Game Complete Screen */}
      {gameComplete && (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="max-w-3xl bg-gray-800 rounded-xl p-8 shadow-lg text-center">
            <h2 className="text-4xl font-bold text-cyan-400 mb-4">Game Complete!</h2>
            <p className="text-2xl mb-8">Congratulations! You've completed all 10 levels.</p>
            
            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-semibold mb-4">Final Score: <span className="text-cyan-400">{score}</span></h3>
              
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-lg font-semibold mb-2">Accuracy</p>
                  <p className="text-3xl font-bold text-yellow-400">{accuracy}%</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">Correct</p>
                  <p className="text-3xl font-bold text-green-400">{statistics.correct}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">Incorrect</p>
                  <p className="text-3xl font-bold text-red-400">{statistics.incorrect}</p>
                </div>
              </div>
              
              <p className="text-lg mb-2">
                You've mastered the art of recognizing mathematical functions!
              </p>
              <p className="text-gray-400">
                Average time per question: {statistics.totalTime > 0 ? 
                  Math.round(statistics.totalTime / (statistics.correct + statistics.incorrect)) : 0} seconds
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                onClick={restartGame} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphGuessingGame;