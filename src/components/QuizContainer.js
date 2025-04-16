import React, { useState, useEffect } from 'react';
import Question from './Question';
import QuizResult from './QuizResult';
import Timer from './Timer';
import ProgressBar from './ProgressBar';
import '../styles/QuizContainer.css';
import { playCorrectSound, playIncorrectSound } from '../utils/soundEffects';

// Sample quiz data - in a real app, this would come from an API or database
const sampleQuizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    timeLimit: 20
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    timeLimit: 15
  },
  {
    id: 3,
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
    timeLimit: 15
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    timeLimit: 20
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au",
    timeLimit: 10
  }
];

const QuizContainer = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('');

  useEffect(() => {
    if (!showResult) {
      setTimeRemaining(sampleQuizData[currentQuestionIndex].timeLimit);
    }
  }, [currentQuestionIndex, showResult]);

  const handleAnswer = (selectedOption) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    const currentQuestion = sampleQuizData[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Play sound effect
    if (isCorrect) {
      playCorrectSound();
      setAnimationType('correct');
    } else {
      playIncorrectSound();
      setAnimationType('incorrect');
    }
    
    setShowAnimation(true);
    
    // Update score if answer is correct
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Save the answer
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedOption,
      correctOption: currentQuestion.correctAnswer,
      isCorrect
    }]);
    
    // Move to next question after a delay
    setTimeout(() => {
      setShowAnimation(false);
      setIsAnswered(false);
      
      if (currentQuestionIndex < sampleQuizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      handleAnswer(null); // Treat as if user didn't answer
    }
  };

  if (showResult) {
    return <QuizResult 
      score={score} 
      totalQuestions={sampleQuizData.length} 
      answers={answers}
      onComplete={() => onComplete(score)}
    />;
  }

  return (
    <div className="quiz-container">
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={sampleQuizData.length} 
      />
      
      <Timer 
        timeRemaining={timeRemaining} 
        setTimeRemaining={setTimeRemaining}
        onTimeUp={handleTimeUp}
        isPaused={isAnswered}
      />
      
      <Question 
        questionData={sampleQuizData[currentQuestionIndex]}
        onSelectOption={handleAnswer}
        isAnswered={isAnswered}
        showAnimation={showAnimation}
        animationType={animationType}
      />
    </div>
  );
};

export default QuizContainer;