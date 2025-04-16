import React, { useState } from 'react';
import './App.css';
import QuizContainer from './components/QuizContainer';
import StartScreen from './components/StartScreen';
import Leaderboard from './components/Leaderboard';
import CreateQuiz from './components/CreateQuiz';

function App() {
  const [currentScreen, setCurrentScreen] = useState('start');
  const [userScore, setUserScore] = useState(0);

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="App">
      {currentScreen === 'start' && (
        <StartScreen onNavigate={navigateTo} />
      )}
      {currentScreen === 'quiz' && (
        <QuizContainer 
          onComplete={(score) => {
            setUserScore(score);
            navigateTo('leaderboard');
          }}
        />
      )}
      {currentScreen === 'leaderboard' && (
        <Leaderboard score={userScore} onNavigate={navigateTo} />
      )}
      {currentScreen === 'create' && (
        <CreateQuiz onNavigate={navigateTo} />
      )}
    </div>
  );
}

export default App;
