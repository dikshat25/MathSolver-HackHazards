import { useState } from 'react';

function ToolsPanel({ tools, onUseHint, onSkipQuestion, onUseExtraTime, usedHint }) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isFormulaScrollOpen, setIsFormulaScrollOpen] = useState(false);
  const [calcExpression, setCalcExpression] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const calculateResult = () => {
    try {
      // Simple evaluation - in a real app, use a safer method
      setCalcResult(eval(calcExpression));
    } catch (error) {
      setCalcResult('Error');
    }
  };

  const handleCalcInput = (value) => {
    if (value === 'C') {
      setCalcExpression('');
      setCalcResult('');
    } else if (value === '=') {
      calculateResult();
    } else {
      setCalcExpression(prev => prev + value);
    }
  };

  return (
    <div className="tools-panel">
      <h3>Tools</h3>
      
      <div className="tools-grid">
        <div className="tool-item">
          <button 
            className={`tool-button hint-token ${tools.hintTokens > 0 && !usedHint ? 'active' : 'disabled'}`}
            onClick={onUseHint}
            disabled={tools.hintTokens === 0 || usedHint}
          >
            <span className="tool-icon">💡</span>
            <span className="tool-count">{tools.hintTokens}</span>
          </button>
          <span className="tool-label">Hint Tokens</span>
        </div>
        
        <div className="tool-item">
          <button 
            className={`tool-button double-hint ${tools.doubleHintTokens > 0 ? 'active' : 'disabled'}`}
            onClick={onUseHint}
            disabled={tools.doubleHintTokens === 0}
          >
            <span className="tool-icon">💡💡</span>
            <span className="tool-count">{tools.doubleHintTokens}</span>
          </button>
          <span className="tool-label">Double Hints</span>
        </div>
        
        <div className="tool-item">
          <button 
            className={`tool-button skip-card ${tools.skipQuestionCards > 0 ? 'active' : 'disabled'}`}
            onClick={onSkipQuestion}
            disabled={tools.skipQuestionCards === 0}
          >
            <span className="tool-icon">⏭️</span>
            <span className="tool-count">{tools.skipQuestionCards}</span>
          </button>
          <span className="tool-label">Skip Cards</span>
        </div>
        
        <div className="tool-item">
          <button 
            className={`tool-button extra-time ${tools.extraTimeTokens > 0 ? 'active' : 'disabled'}`}
            onClick={onUseExtraTime}
            disabled={tools.extraTimeTokens === 0}
          >
            <span className="tool-icon">⏱️+</span>
            <span className="tool-count">{tools.extraTimeTokens}</span>
          </button>
          <span className="tool-label">Extra Time</span>
        </div>
        
        <div className="tool-item">
          <button 
            className={`tool-button calculator ${tools.calculator ? 'active' : 'disabled'}`}
            onClick={() => tools.calculator && setIsCalculatorOpen(!isCalculatorOpen)}
            disabled={!tools.calculator}
          >
            <span className="tool-icon">🧮</span>
          </button>
          <span className="tool-label">Calculator</span>
        </div>
        
        <div className="tool-item">
          <button 
            className={`tool-button formula ${tools.formulaScroll ? 'active' : 'disabled'}`}
            onClick={() => tools.formulaScroll && setIsFormulaScrollOpen(!isFormulaScrollOpen)}
            disabled={!tools.formulaScroll}
          >
            <span className="tool-icon">📜</span>
          </button>
          <span className="tool-label">Formula Scroll</span>
        </div>
        
        <div className="tool-item">
          <button className={`tool-button master-key ${tools.masterKey ? 'active' : 'disabled'}`}>
            <span className="tool-icon">🔑</span>
          </button>
          <span className="tool-label">Master Key</span>
        </div>
      </div>
      
      {isCalculatorOpen && (
        <div className="calculator-modal">
          <div className="calculator-header">
            <h4>Calculator</h4>
            <button onClick={() => setIsCalculatorOpen(false)}>×</button>
          </div>
          <div className="calculator-display">
            <div className="calc-expression">{calcExpression}</div>
            <div className="calc-result">{calcResult}</div>
          </div>
          <div className="calculator-buttons">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map(btn => (
              <button 
                key={btn} 
                onClick={() => handleCalcInput(btn)}
                className={`calc-btn ${btn === 'C' ? 'clear' : btn === '=' ? 'equals' : ''}`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isFormulaScrollOpen && (
        <div className="formula-modal">
          <div className="formula-header">
            <h4>Formula Scroll</h4>
            <button onClick={() => setIsFormulaScrollOpen(false)}>×</button>
          </div>
          <div className="formula-content">
            <div className="formula-section">
              <h5>Area Formulas</h5>
              <p>Rectangle: A = l × w</p>
              <p>Circle: A = π × r²</p>
              <p>Triangle: A = (b × h) ÷ 2</p>
            </div>
            <div className="formula-section">
              <h5>Algebra</h5>
              <p>Quadratic Formula: x = (-b ± √(b² - 4ac)) ÷ 2a</p>
              <p>Linear Equation: y = mx + b</p>
            </div>
            <div className="formula-section">
              <h5>Number Sequences</h5>
              <p>Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...</p>
              <p>Square Numbers: 1, 4, 9, 16, 25, 36, ...</p>
              <p>Prime Numbers: 2, 3, 5, 7, 11, 13, 17, ...</p>
            </div>
            <div className="formula-section">
              <h5>Probability</h5>
              <p>P(event) = Number of favorable outcomes ÷ Total number of possible outcomes</p>
              <p>Odds = Probability ÷ (1 - Probability)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsPanel;