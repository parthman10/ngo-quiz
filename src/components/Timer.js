import React, { useEffect } from 'react';
import '../styles/Timer.css';

const Timer = ({ timeRemaining, setTimeRemaining, onTimeUp, isPaused }) => {
  useEffect(() => {
    if (timeRemaining === 0) {
      onTimeUp();
      return;
    }

    if (isPaused) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, setTimeRemaining, onTimeUp, isPaused]);

  const getTimerClass = () => {
    if (timeRemaining <= 5) return "timer-circle critical";
    if (timeRemaining <= 10) return "timer-circle warning";
    return "timer-circle";
  };

  return (
    <div className="timer-container">
      <div className={getTimerClass()}>
        <span className="timer-text">{timeRemaining}</span>
      </div>
    </div>
  );
};

export default Timer;