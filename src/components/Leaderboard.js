import React, { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

const Leaderboard = ({ score, onNavigate }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  
  useEffect(() => {
    // Load and sort leaderboard from localStorage
    const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]')
      .filter(entry => entry.username !== 'Anonymous')
      .sort((a, b) => {
        // First, sort by percentage descending
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        // If percentages are equal, sort by date ascending (earlier first)
        return new Date(a.date) - new Date(b.date);
      });
    setLeaderboard(savedLeaderboard);

    if (score > 0) {
      setShowNameInput(true);
    }
  }, [score]);

  const handleSaveUsername = () => {
    if (username.trim()) {
      setShowNameInput(false);

      const currentLeaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]')
        .filter(entry => entry.username !== 'Anonymous');

      // Calculate the percentage score assuming 5 total questions
      // The 'score' prop holds the number of correct answers (e.g., 3)
      const totalQuestions = 5; // Assuming 5 questions based on the image
      const scorePercentage = (score / totalQuestions) * 100;

      // If 'score' prop represents the number of correct answers instead of the percentage,
      // you would need to calculate the percentage here. For example:
      // const totalQuestions = 10; // Assuming 10 questions
      // const scorePercentage = (score / totalQuestions) * 100;

      const newEntry = {
        username: username.trim(),
        percentage: scorePercentage, // Save the calculated percentage
        date: new Date().toISOString() // Timestamp the entry
      };

      const updatedLeaderboard = [newEntry, ...currentLeaderboard]
        .sort((a, b) => {
           // First, sort by percentage descending
           if (b.percentage !== a.percentage) {
             return b.percentage - a.percentage;
           }
           // If percentages are equal, sort by date ascending (earlier first)
           return new Date(a.date) - new Date(b.date);
        });

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
      setUsername(''); // Clear username input after saving
    } else {
      alert('Please enter your name before saving your score!');
    }
  };

  // Add cleanup when navigating away
  const handleNavigate = (destination) => {
    localStorage.removeItem('username');
    onNavigate(destination);
  };

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">Leaderboard</h2>
      
      {showNameInput && (
        <div className="username-input-container">
          <p>Congratulations on your score! Please enter your name:</p>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="username-input"
            />
            <button onClick={handleSaveUsername} className="save-button">Save</button>
          </div>
        </div>
      )}
      
      {leaderboard.length > 0 ? (
        <div className="scores-table">
          <div className="table-header">
            <div className="rank-cell">Rank</div>
            <div className="name-cell">Name</div>
            <div className="score-cell">Score</div>
            <div className="date-cell">Date</div>
          </div>
          
          {leaderboard.map((entry, index) => (
            <div key={index} className={`table-row ${index === 0 ? 'top-score' : ''}`}>
              <div className="rank-cell">{index + 1}</div>
              <div className="name-cell">{entry.username}</div>
              <div className="score-cell">{entry.percentage}%</div>
              <div className="date-cell">{new Date(entry.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-scores">No scores yet. Be the first to play!</p>
      )}
      
      <div className="leaderboard-buttons">
        <button 
          className="play-again-button"
          onClick={() => handleNavigate('quiz')}
        >
          Play Again
        </button>
        
        <button 
          className="home-button"
          onClick={() => handleNavigate('start')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;