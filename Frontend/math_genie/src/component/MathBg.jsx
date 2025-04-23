export default function MathBackground({ isDarkMode }) {
    const getRandomMathSymbol = () => {
      const symbols = [
        '∑', '+', '-', '×', '÷', '=', 'π', '√', '∫', 'Δ', '∞', '≠', '≈', '≤', '≥',
        'α', 'β', 'γ', 'θ', 'λ', 'μ', 'σ', 'φ', 'Ω', '∂', '∇', '∃', '∀', '∈', '∉'
      ];
      return symbols[Math.floor(Math.random() * symbols.length)];
    };
  
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className={`absolute ${isDarkMode ? 'text-purple-300' : 'text-purple-900'} opacity-10 select-none`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              fontSize: `${Math.random() * 2 + 1}rem`
            }}
          >
            {getRandomMathSymbol()}
          </div>
        ))}
      </div>
    );
  }