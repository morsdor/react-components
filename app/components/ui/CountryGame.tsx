'use client'

import { useState, useEffect } from 'react'
import { StarRating } from './StarRating'
import { useToast } from '../toast/ToastProvider'

interface Country {
  id: string
  label: string
  capital: string
}

interface GameState {
  currentQuestion: number
  score: number
  totalQuestions: number
  countries: Country[]
  gameStatus: 'playing' | 'completed' | 'paused'
  timeRemaining: number
  userAnswer: string
  showResult: boolean
  lastAnswerCorrect: boolean | null
}

interface CountryGameProps {
  countries: Country[]
  questionsPerGame?: number
  timePerQuestion?: number
}

/**
 * Country capital quiz game demonstrating component composition
 * Combines multiple components: form inputs, notifications, progress bars, star ratings
 */
export function CountryGame({ 
  countries, 
  questionsPerGame = 10, 
  timePerQuestion = 30 
}: CountryGameProps) {
  const { addToast } = useToast()
  
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    totalQuestions: questionsPerGame,
    countries: [],
    gameStatus: 'playing',
    timeRemaining: timePerQuestion,
    userAnswer: '',
    showResult: false,
    lastAnswerCorrect: null
  })

  // Initialize game
  useEffect(() => {
    startNewGame()
  }, [])

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }))
      }, 1000)

      return () => clearTimeout(timer)
    } else if (gameState.timeRemaining === 0 && gameState.gameStatus === 'playing') {
      handleTimeUp()
    }
  }, [gameState.timeRemaining, gameState.gameStatus])

  /**
   * Start a new game
   */
  const startNewGame = () => {
    const shuffledCountries = [...countries].sort(() => Math.random() - 0.5)
    const gameCountries = shuffledCountries.slice(0, questionsPerGame)
    
    setGameState({
      currentQuestion: 0,
      score: 0,
      totalQuestions: questionsPerGame,
      countries: gameCountries,
      gameStatus: 'playing',
      timeRemaining: timePerQuestion,
      userAnswer: '',
      showResult: false,
      lastAnswerCorrect: null
    })

    addToast({
      type: 'info',
      title: 'New Game Started!',
      message: `Answer ${questionsPerGame} questions about country capitals.`
    })
  }

  /**
   * Handle answer submission
   */
  const submitAnswer = () => {
    if (!gameState.userAnswer.trim()) return

    const currentCountry = gameState.countries[gameState.currentQuestion]
    const isCorrect = gameState.userAnswer.toLowerCase().trim() === 
                     currentCountry.capital.toLowerCase().trim()

    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      showResult: true,
      lastAnswerCorrect: isCorrect
    }))

    // Show feedback toast
    addToast({
      type: isCorrect ? 'success' : 'error',
      title: isCorrect ? 'Correct!' : 'Incorrect',
      message: isCorrect 
        ? `Great job! The capital of ${currentCountry.label} is ${currentCountry.capital}.`
        : `The capital of ${currentCountry.label} is ${currentCountry.capital}.`
    })

    // Move to next question after delay
    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  /**
   * Move to next question
   */
  const nextQuestion = () => {
    if (gameState.currentQuestion + 1 >= gameState.totalQuestions) {
      endGame()
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        timeRemaining: timePerQuestion,
        userAnswer: '',
        showResult: false,
        lastAnswerCorrect: null
      }))
    }
  }

  /**
   * Handle time up
   */
  const handleTimeUp = () => {
    const currentCountry = gameState.countries[gameState.currentQuestion]
    
    setGameState(prev => ({
      ...prev,
      showResult: true,
      lastAnswerCorrect: false
    }))

    addToast({
      type: 'warning',
      title: 'Time\'s Up!',
      message: `The capital of ${currentCountry.label} is ${currentCountry.capital}.`
    })

    setTimeout(() => {
      nextQuestion()
    }, 2000)
  }

  /**
   * End the game
   */
  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: 'completed'
    }))

    const percentage = (gameState.score / gameState.totalQuestions) * 100
    let message = ''
    
    if (percentage >= 80) {
      message = 'Excellent work! You\'re a geography expert!'
    } else if (percentage >= 60) {
      message = 'Good job! Keep practicing to improve.'
    } else {
      message = 'Keep studying! Geography can be tricky.'
    }

    addToast({
      type: 'info',
      title: 'Game Complete!',
      message: `You scored ${gameState.score}/${gameState.totalQuestions}. ${message}`
    })
  }

  /**
   * Handle key press for answer submission
   */
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !gameState.showResult) {
      submitAnswer()
    }
  }

  if (gameState.gameStatus === 'completed') {
    const percentage = (gameState.score / gameState.totalQuestions) * 100
    const starRating = Math.round((percentage / 100) * 5 * 2) / 2 // Convert to 5-star scale with half stars

    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {gameState.score}/{gameState.totalQuestions}
          </div>
          <p className="text-gray-600">
            You got {percentage.toFixed(0)}% correct
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Your Performance:</p>
          <div className="flex justify-center">
            <StarRating
              value={starRating}
              readonly={true}
              size="lg"
              showValue={true}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-600">{gameState.score}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div>
                <div className="font-medium text-red-600">
                  {gameState.totalQuestions - gameState.score}
                </div>
                <div className="text-gray-600">Incorrect</div>
              </div>
              <div>
                <div className="font-medium text-blue-600">{percentage.toFixed(0)}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>

          <button
            onClick={startNewGame}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  const currentCountry = gameState.countries[gameState.currentQuestion]
  const progress = ((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Game header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Country Capital Quiz</h2>
          <p className="text-gray-600">
            Question {gameState.currentQuestion + 1} of {gameState.totalQuestions}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {gameState.score}/{gameState.totalQuestions}
          </div>
          <div className="text-sm text-gray-600">Score</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Time Remaining</span>
          <span className={`text-lg font-bold ${
            gameState.timeRemaining <= 10 ? 'text-red-600' : 'text-gray-900'
          }`}>
            {gameState.timeRemaining}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div
            className={`h-1 rounded-full transition-all duration-1000 ${
              gameState.timeRemaining <= 10 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${(gameState.timeRemaining / timePerQuestion) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {currentCountry && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            What is the capital of <span className="text-blue-600">{currentCountry.label}</span>?
          </h3>

          {!gameState.showResult ? (
            <div className="space-y-4">
              <input
                type="text"
                value={gameState.userAnswer}
                onChange={(e) => setGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                onKeyPress={handleKeyPress}
                placeholder="Enter the capital city..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                disabled={gameState.showResult}
                autoFocus
              />
              
              <button
                onClick={submitAnswer}
                disabled={!gameState.userAnswer.trim() || gameState.showResult}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-lg ${
              gameState.lastAnswerCorrect 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="text-center">
                <div className={`text-lg font-semibold mb-2 ${
                  gameState.lastAnswerCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {gameState.lastAnswerCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                <p className="text-gray-700">
                  The capital of {currentCountry.label} is <strong>{currentCountry.capital}</strong>
                </p>
                {gameState.userAnswer && !gameState.lastAnswerCorrect && (
                  <p className="text-sm text-gray-600 mt-1">
                    You answered: {gameState.userAnswer}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
