// Options.jsx
import React from 'react';

const Options = ({ options, onSelect, selected, correct }) => {
  return (
    <div>
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(opt)}
          disabled={selected}
          className={`card btn ${
            selected
              ? opt === correct
                ? 'correct'
                : opt === selected
                ? 'wrong'
                : ''
              : ''
          }`}
          style={{
            margin: '0.5rem',
            padding: '1rem 2rem',
            cursor: 'pointer',
            borderRadius: '10px',
            background:
              selected && opt === correct
                ? '#4CAF50'
                : selected && opt === selected
                ? '#FF6B6B'
                : '#f0f0f0',
            border: 'none',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default Options;
