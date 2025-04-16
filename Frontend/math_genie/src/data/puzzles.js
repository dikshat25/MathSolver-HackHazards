const puzzles = [
    {
      level: 1,
      question: "I am a 2-digit number. My digits add to 10. I'm divisible by 4. Who am I?",
      answers: [28, 40, 52, 64, 76, 88], // accept any of these
      hint: "Think of numbers where the digits add to 10, then check which ones are divisible by 4.",
      toolUnlocked: "Hint Token",
      timeLimit: 120, // in seconds
    },
    {
      level: 2,
      question: "What comes next in the pattern? 2, 4, 8, 16, __",
      answers: [32],
      hint: "Each number is doubled to get the next number.",
      toolUnlocked: "Skip Question Card",
      timeLimit: 120,
    },
    {
      level: 3,
      question: "Which number doesn't belong? 3, 5, 11, 14, 17",
      answers: [14],
      hint: "Most of these numbers share a common property related to divisibility.",
      toolUnlocked: "Calculator",
      timeLimit: 150,
    },
    {
      level: 4,
      question: "Decode the pattern: 1, 4, 9, 16, 25, __",
      answers: [36],
      hint: "Think about perfect squares.",
      toolUnlocked: null,
      timeLimit: 150,
    },
    {
      level: 5,
      question: "I am a prime number less than 50. When you add my digits, you get 10. Who am I?",
      answers: [19, 37, 43],
      hint: "List the prime numbers under 50, then check which ones have digits that sum to 10.",
      toolUnlocked: "Formula Scroll",
      timeLimit: 180,
    },
    {
      level: 6,
      question: "My prime factorization is 2² × 3 × 5. What number am I?",
      answers: [60],
      hint: "Calculate 2² first, then multiply by the other factors.",
      toolUnlocked: null,
      timeLimit: 180,
    },
    {
      level: 7,
      question: "If 3x + 7 = 22, what is the value of 2x - 5?",
      answers: [5],
      hint: "First solve for x, then substitute into the expression 2x - 5.",
      toolUnlocked: "Extra Time Token",
      timeLimit: 210,
    },
    {
      level: 8,
      question: "The sum of three consecutive integers is 42. What is the middle integer?",
      answers: [14],
      hint: "If the middle integer is n, the three consecutive integers are n-1, n, and n+1.",
      toolUnlocked: null,
      timeLimit: 210,
    },
    {
      level: 9,
      question: "In a group of 25 students, 12 take math, 8 take science, and 3 take both. How many students take neither math nor science?",
      answers: [8],
      hint: "Use the formula: Total = Math + Science - Both + Neither",
      toolUnlocked: "Double Hint Token",
      timeLimit: 240,
    },
    {
      level: 10,
      question: "If the probability of an event occurring is 0.4, what are the odds against it occurring?",
      answers: [1.5, "3/2", "3:2"],
      hint: "Odds against = (1 - probability) / probability",
      toolUnlocked: "Master Key",
      timeLimit: 240,
    },
  ];
  
  export default puzzles;