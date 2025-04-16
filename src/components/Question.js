import React from 'react';
import '../styles/Question.css';
import Confetti from './Confetti';

const Question = ({ questionData, onSelectOption, isAnswered, showAnimation, animationType }) => {
  const { question, options, correctAnswer } = questionData;

  const getOptionClassName = (option) => {
    if (!isAnswered) return "option";
    
    if (option === correctAnswer) {
      return "option correct";
    }
    
    return "option";
  };

  return (
    <div className={`question-container ${showAnimation ? animationType : ''}`}>
      {showAnimation && animationType === 'correct' && <Confetti />}
      
      <h2 className="question-text">{question}</h2>
      
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(option)}
            onClick={() => onSelectOption(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      
      {isAnswered && showAnimation && (
        <div className={`feedback-message ${animationType}`}>
          {animationType === 'correct' ? 'Great job!' : 'Try again!'}
        </div>
      )}
    </div>
  );
};

export default Question;