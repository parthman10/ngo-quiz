import React, { useEffect } from 'react';
import '../styles/QuizResult.css';
import Confetti from './Confetti';

const QuizResult = ({ score, totalQuestions, answers, onComplete }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfectScore = score === totalQuestions;
  
  useEffect(() => {
    // Auto-save score to leaderboard
    const username = localStorage.getItem('username') || 'Anonymous';
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    
    leaderboard.push({
      username,
      score,
      totalQuestions,
      percentage,
      date: new Date().toISOString()
    });
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.percentage - a.percentage);
    
    // Keep only top 10
    const topScores = leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(topScores));
  }, [score, totalQuestions, percentage]);

  return (
    <div className="result-container">
      {isPerfectScore && <Confetti />}
      
      <h2 className="result-title">Quiz Results</h2>
      
      <div className="score-display">
        <div className="score-circle">
          <span className="score-text">{percentage}%</span>
        </div>
        <p className="score-details">You got {score} out of {totalQuestions} questions correct!</p>
      </div>
      
      <div className="feedback-message">
        {percentage >= 80 ? 'Excellent work!' : 
         percentage >= 60 ? 'Good job!' : 
         percentage >= 40 ? 'Nice effort!' : 'Keep practicing!'}
      </div>
      
      <h3 className="answers-title">Question Summary</h3>
      
      <div className="answers-list">
        {answers.map((answer, index) => (
          <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <p className="answer-question">Q{index + 1}: {answer.question}</p>
            <p className="answer-details">
              Your answer: <span className={answer.isCorrect ? 'correct-text' : 'incorrect-text'}>
                {answer.selectedOption || 'No answer'}
              </span>
            </p>
            {!answer.isCorrect && (
              <p className="correct-answer">
                Correct answer: <span className="correct-text">{answer.correctOption}</span>
              </p>
            )}
          </div>
        ))}
      </div>
      
      <button className="continue-button" onClick={onComplete}>
        Continue to Leaderboard
      </button>
    </div>
  );
};

export default QuizResult;