import React, { useState, useEffect, useRef } from 'react';
import './MathEscapeRoom.css';

const MathEscapeRoom = () => {
  // Game state
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // Increased time to 3 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [usedHints, setUsedHints] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shakePuzzle, setShakePuzzle] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dungeon');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  
  // Audio refs
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const unlockSoundRef = useRef(null);
  const hintSoundRef = useRef(null);
  const timerSoundRef = useRef(null);
  const ambientSoundRef = useRef(null);
  const startSoundRef = useRef(null);
  const completeSoundRef = useRef(null);
  const lowTimeSoundRef = useRef(null);

  // Room themes for different level ranges
  const themes = {
    dungeon: {
      name: "Ancient Dungeon",
      description: "A dark stone dungeon filled with ancient mathematical inscriptions",
      bgColor: "#2d2d30",
      textColor: "#e9c46a",
      accentColor: "#e76f51",
    },
    laboratory: {
      name: "Mad Scientist's Lab",
      description: "A chaotic laboratory with complex equations scribbled on the walls",
      bgColor: "#1a3e59",
      textColor: "#50b2c0",
      accentColor: "#c23c64",
    },
    library: {
      name: "Forgotten Library",
      description: "Dusty bookshelves filled with mathematical tomes and secret formulas",
      bgColor: "#3c2a21",
      textColor: "#e5e5cb",
      accentColor: "#d5cea3",
    },
    digital: {
      name: "Digital Vault",
      description: "A high-tech room with glowing screens and binary code patterns",
      bgColor: "#1a1b26",
      textColor: "#7dcfff",
      accentColor: "#bb9af7",
    },
  };

  // Puzzle data for each level
  const puzzles = [
    {
      level: 1,
      question: "I am a 2-digit number. My digits add to 10. I'm divisible by 4. Who am I?",
      answer: ["28", "40", "64", "82"],
      hint: "Start with numbers between 19 and 91 whose digits sum to 10, then check divisibility by 4.",
      flavor: "The ancient lock has a numeric dial with a riddle inscribed above it."
    },
    {
      level: 2,
      question: "What is the next number in this sequence: 2, 4, 8, 16, ___?",
      answer: ["32"],
      hint: "Each number is multiplied by 2 to get the next.",
      flavor: "A sequence of glowing symbols appears on the wall, with one symbol missing."
    },
    {
      level: 3,
      question: "I'm a prime number between 20 and 30. The sum of my digits is also prime. Who am I?",
      answer: ["23"],
      hint: "Prime numbers between 20-30 are 23, 29. Check their digit sums.",
      flavor: "An old chest with a number lock sits in the corner. The lid has a cryptic poem about primes."
    },
    {
      level: 4,
      question: "Solve for x: 3x + 7 = 22",
      answer: ["5"],
      hint: "Subtract 7 from both sides first, then divide by 3.",
      flavor: "A hidden panel with an equation appears when you shine light on the wall."
    },
    {
      level: 5,
      question: "What is the sum of the first 5 Fibonacci numbers? (Fibonacci sequence: 1, 1, 2, 3, 5, ...)",
      answer: ["12"],
      hint: "Add 1 + 1 + 2 + 3 + 5",
      flavor: "A spiral pattern on the floor matches the Fibonacci sequence, with numbered tiles."
    },
    {
      level: 6,
      question: "How many prime factors does the number 42 have?",
      answer: ["3"],
      hint: "Prime factors are prime numbers that multiply to give the original number (2, 3, 7 for 42).",
      flavor: "A strange machine with gears displays the number 42 and waits for input about its factors."
    },
    {
      level: 7,
      question: "If a number is divisible by both 3 and 5, what is the smallest positive number it must also be divisible by?",
      answer: ["15"],
      hint: "Think about the least common multiple of 3 and 5.",
      flavor: "Two ancient symbols for 3 and 5 are carved into a doorway, blocking your path."
    },
    {
      level: 8,
      question: "What is the missing number in this pattern: 1, 4, 9, __, 25, 36",
      answer: ["16"],
      hint: "These are perfect squares of consecutive integers.",
      flavor: "A grid on the floor has tiles with numbers, but one tile is missing its value."
    },
    {
      level: 9,
      question: "A number is 4 more than twice another number. If their sum is 19, what is the larger number?",
      answer: ["14"],
      hint: "Set up equations: x = 2y + 4 and x + y = 19, then solve.",
      flavor: "Two mechanical scales are balancing numbers, with a complex lock mechanism attached."
    },
    {
      level: 10,
      question: "What is the digital root of 9875? (Digital root is the recursive sum of all digits until you get a single digit)",
      answer: ["2"],
      hint: "9+8+7+5=29, then 2+9=11, then 1+1=2",
      flavor: "The final door has a complex mechanism with multiple spinning dials showing the number 9875."
    }
  ];

  // Tools that can be unlocked
  const tools = [
    { id: 1, name: "Basic Calculator", levelUnlocked: 3, emoji: "🧮", description: "An old abacus that helps with basic calculations." },
    { id: 2, name: "Formula Scroll", levelUnlocked: 5, emoji: "📜", description: "A mysterious scroll with common math formulas." },
    { id: 3, name: "Skip Question", levelUnlocked: 7, emoji: "⏭️", description: "A magical key that opens one door without solving its puzzle." },
    { id: 4, name: "Extra Time", levelUnlocked: 9, emoji: "⏱️", description: "An ancient hourglass that adds 60 seconds to your timer." }
  ];

  // Update theme based on current level
  useEffect(() => {
    if (currentLevel <= 3) {
      setCurrentTheme('dungeon');
    } else if (currentLevel <= 6) {
      setCurrentTheme('laboratory');
    } else if (currentLevel <= 8) {
      setCurrentTheme('library');
    } else {
      setCurrentTheme('digital');
    }
  }, [currentLevel]);

  // Play ambient sound based on theme
  useEffect(() => {
    if (gameStarted && !gameCompleted && !gameOver && ambientSoundRef.current) {
      if (!ambientPlaying) {
        ambientSoundRef.current.volume = 0.2;
        ambientSoundRef.current.loop = true;
        ambientSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
        setAmbientPlaying(true);
      }
    } else if (ambientSoundRef.current && ambientPlaying) {
      ambientSoundRef.current.pause();
      setAmbientPlaying(false);
    }
    
    return () => {
      if (ambientSoundRef.current) {
        ambientSoundRef.current.pause();
      }
    };
  }, [gameStarted, gameCompleted, gameOver, currentTheme]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameCompleted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        // Play warning sound when time is low
        if (prev === 30 && lowTimeSoundRef.current) {
          lowTimeSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
        }
        
        // Tick faster when time is low
        if (prev <= 10 && timerSoundRef.current) {
          timerSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
        }
        
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setMessage("Time's up! The room has locked you in!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted, gameOver]);

  // Check if player has unlocked new tools
  useEffect(() => {
    const newTools = tools.filter(tool => 
      tool.levelUnlocked === currentLevel && 
      !inventory.some(item => item.id === tool.id)
    );
    
    if (newTools.length > 0) {
      setInventory(prev => [...prev, ...newTools]);
      setNotificationText(`You found a new tool: ${newTools[0].emoji} ${newTools[0].name}!`);
      setShowNotification(true);
      
      if (unlockSoundRef.current) {
        unlockSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
      }
      
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    }
  }, [currentLevel]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(180);
    setCurrentLevel(1);
    setScore(0);
    setInventory([]);
    setUsedHints(0);
    setMessage("You're locked in! Solve the puzzle to unlock the door!");
    setGameOver(false);
    setGameCompleted(false);
    
    if (startSoundRef.current) {
      startSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
    }
  };

  // Check answer
  const checkAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const currentPuzzle = puzzles.find(p => p.level === currentLevel);
    
    if (currentPuzzle.answer.includes(userAnswer.trim())) {
      // Correct answer
      if (correctSoundRef.current) {
        correctSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
      }
      
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 1000);
      
      const timeBonus = Math.floor(timeLeft / 10);
      const levelScore = currentLevel * 10 + timeBonus;
      setScore(prev => prev + levelScore);
      
      setMessage(`Correct! The door unlocks with a satisfying click. +${levelScore} points.`);
      setUserAnswer('');
      setShowHint(false);
      
      setTimeout(() => {
        if (currentLevel < puzzles.length) {
          setCurrentLevel(prev => prev + 1);
          setTimeLeft(180);
          setMessage(`You've entered room ${currentLevel + 1}. A new puzzle awaits!`);
        } else {
          setGameCompleted(true);
          setMessage(`Congratulations! You've escaped all the rooms with ${score} points!`);
          
          if (completeSoundRef.current) {
            completeSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
          }
        }
      }, 1500);
    } else {
      // Wrong answer
      if (wrongSoundRef.current) {
        wrongSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
      }
      
      setShakePuzzle(true);
      setTimeout(() => setShakePuzzle(false), 500);
      
      setMessage("The lock doesn't budge. That's not the right answer!");
    }
  };

  // Use hint
  const useHint = () => {
    if (usedHints < 3) {
      setShowHint(true);
      setUsedHints(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 5)); // Deduct 5 points for using hint
      setMessage("You've used a hint! -5 points.");
      
      if (hintSoundRef.current) {
        hintSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
      }
    } else {
      setMessage("No hints left! You must solve this on your own.");
    }
  };

  // Use Extra Time tool
  const useExtraTime = () => {
    const hasExtraTime = inventory.some(item => item.name === "Extra Time");
    
    if (hasExtraTime) {
      setTimeLeft(prev => prev + 60);
      setInventory(prev => prev.filter(item => item.name !== "Extra Time"));
      setMessage("You've used the hourglass! +60 seconds added to your timer.");
      
      if (unlockSoundRef.current) {
        unlockSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
      }
    }
  };

  // Skip question (if player has the tool)
  const skipQuestion = () => {
    const hasSkip = inventory.some(item => item.name === "Skip Question");
    
    if (hasSkip) {
      setInventory(prev => prev.filter(item => item.name !== "Skip Question"));
      setMessage("You've used the magical key! This door unlocks automatically.");
      setUserAnswer('');
      setShowHint(false);
      
      if (unlockSoundRef.current) {
        unlockSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
      }
      
      setTimeout(() => {
        if (currentLevel < puzzles.length) {
          setCurrentLevel(prev => prev + 1);
          setTimeLeft(180);
          setMessage(`You've entered room ${currentLevel + 1}. A new puzzle awaits!`);
        } else {
          setGameCompleted(true);
          setMessage(`Congratulations! You've escaped all the rooms with ${score} points!`);
          
          if (completeSoundRef.current) {
            completeSoundRef.current.play().catch(e => console.log('Audio play prevented:', e));
          }
        }
      }, 1500);
    } else {
      setMessage("You don't have a magical key to skip this room!");
    }
  };

  // Get current puzzle
  const currentPuzzle = puzzles.find(p => p.level === currentLevel) || puzzles[0];
  const currentThemeData = themes[currentTheme];

  return (
    <div className="escape-room-container" style={{
      backgroundColor: currentThemeData.bgColor,
      color: currentThemeData.textColor
    }}>
      {/* Audio elements */}
      <audio ref={correctSoundRef} src="/sounds/correct.mp3"></audio>
      <audio ref={wrongSoundRef} src="/sounds/wrong.mp3"></audio>
      <audio ref={unlockSoundRef} src="/sounds/unlock.mp3"></audio>
      <audio ref={hintSoundRef} src="/sounds/hint.mp3"></audio>
      <audio ref={timerSoundRef} src="/sounds/tick.mp3"></audio>
      <audio ref={lowTimeSoundRef} src="/sounds/warning.mp3"></audio>
      <audio ref={startSoundRef} src="/sounds/gamestart.mp3"></audio>
      <audio ref={completeSoundRef} src="/sounds/complete.mp3"></audio>
      <audio ref={ambientSoundRef} src={`/sounds/${currentTheme}_ambient.mp3`}></audio>
      
      <div className="theme-overlay"></div>
      
      <h1 className="game-title">
        <span className="escape-icon">🔒</span> 
        Math Escape Challenge
        <span className="escape-icon">🧩</span>
      </h1>
      
      {!gameStarted ? (
        <div className="start-screen">
          <div className="start-content">
            <h2>Welcome to the Mathematical Labyrinth</h2>
            <p>You've been locked in a series of mysterious rooms, each sealed with a mathematical puzzle.</p>
            <p>Solve each puzzle within the time limit to proceed to the next room and eventually escape!</p>
            <p>Find tools along the way to help you on your journey.</p>
            <button className="start-button" onClick={startGame}>
              <span className="button-icon">🔑</span> Enter the Labyrinth
            </button>
          </div>
        </div>
      ) : gameCompleted ? (
        <div className="end-screen">
          <div className="victory-content">
            <h2>🎉 Escape Successful! 🎉</h2>
            <p>You've solved all the mathematical puzzles and escaped the labyrinth!</p>
            <div className="results">
              <div className="result-item">
                <span className="result-label">Final Score:</span>
                <span className="result-value">{score} points</span>
              </div>
              <div className="result-item">
                <span className="result-label">Hints used:</span>
                <span className="result-value">{usedHints}/3</span>
              </div>
              <div className="result-item">
                <span className="result-label">Tools collected:</span>
                <span className="result-value">{inventory.length}/4</span>
              </div>
            </div>
            <button className="restart-button" onClick={startGame}>Challenge Again</button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <div className="game-over-content">
            <h2>⚠️ Time's Up! ⚠️</h2>
            <p>The doors have sealed permanently. You're trapped in the mathematical labyrinth!</p>
            <div className="results">
              <div className="result-item">
                <span className="result-label">Final Score:</span>
                <span className="result-value">{score} points</span>
              </div>
              <div className="result-item">
                <span className="result-label">Rooms Cleared:</span>
                <span className="result-value">{currentLevel - 1}/{puzzles.length}</span>
              </div>
            </div>
            <button className="restart-button" onClick={startGame}>Try Again</button>
          </div>
        </div>
      ) : (
        <div className="game-screen">
          <div className="theme-name">
            <span className="theme-icon">
              {currentTheme === 'dungeon' ? '🏰' : 
               currentTheme === 'laboratory' ? '⚗️' : 
               currentTheme === 'library' ? '📚' : '💻'}
            </span>
            {currentThemeData.name}
          </div>
          
          <div className="room-info">
            <div className="room-number">Room {currentLevel} of {puzzles.length}</div>
            <div className={`timer ${timeLeft <= 30 ? 'warning' : ''} ${timeLeft <= 10 ? 'danger' : ''}`}>
              ⏱️ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
            <div className="score">🏆 Score: {score}</div>
          </div>
          
          <div className="progress-tracker">
            {puzzles.map((puzzle, index) => (
              <div 
                key={puzzle.level} 
                className={`progress-room ${currentLevel > puzzle.level ? 'unlocked' : ''} ${currentLevel === puzzle.level ? 'current' : ''}`}
              >
                {currentLevel > puzzle.level ? (
                  <span className="unlocked-icon">🔓</span>
                ) : currentLevel === puzzle.level ? (
                  <span className="current-icon">🔎</span>
                ) : (
                  <span className="locked-icon">🔒</span>
                )}
              </div>
            ))}
          </div>
          
          <div className={`puzzle-container ${shakePuzzle ? 'shake' : ''} ${pulseEffect ? 'pulse' : ''}`}>
            <div className="puzzle-flavor">
              {currentPuzzle.flavor}
            </div>
            
            <div className="puzzle-challenge">
              <h3>
                <span className="puzzle-icon">🔐</span> 
                The Challenge:
              </h3>
              <p className="puzzle-question">{currentPuzzle.question}</p>
              
              {showHint && (
                <div className="hint-box">
                  <p>
                    <span className="hint-icon">💡</span>
                    <span className="hint-text">{currentPuzzle.hint}</span>
                  </p>
                </div>
              )}
              
              <div className="answer-input">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer..."
                  onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                />
                <button 
                  className="submit-button" 
                  onClick={checkAnswer}
                  style={{ backgroundColor: currentThemeData.accentColor }}
                >
                  <span className="button-text">Unlock</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="message-box">{message}</div>
          
          <div className="toolbar">
            <button 
              className="tool-button" 
              onClick={useHint} 
              disabled={usedHints >= 3}
              style={{ opacity: usedHints >= 3 ? 0.5 : 1 }}
            >
              <span className="tool-icon">💡</span>
              <span className="tool-text">Use Hint ({3 - usedHints} left)</span>
            </button>
            
            {inventory.some(item => item.name === "Skip Question") && (
              <button className="tool-button" onClick={skipQuestion}>
                <span className="tool-icon">⏭️</span>
                <span className="tool-text">Skip Room</span>
              </button>
            )}
            
            {inventory.some(item => item.name === "Extra Time") && (
              <button className="tool-button" onClick={useExtraTime}>
                <span className="tool-icon">⏱️</span>
                <span className="tool-text">Add Time</span>
              </button>
            )}
          </div>
          
          <div className="inventory-panel">
            <h4>
              <span className="inventory-icon">🎒</span>
              Your Tools:
            </h4>
            
            {inventory.length > 0 ? (
              <div className="inventory-items">
                {inventory.map(tool => (
                  <div key={tool.id} className="inventory-item" title={tool.description}>
                    <span className="tool-emoji">{tool.emoji}</span>
                    <span className="tool-name">{tool.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-tools">No tools yet. Solve more puzzles to find tools!</p>
            )}
          </div>
          
          {showNotification && (
            <div className="notification">
              {notificationText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MathEscapeRoom;