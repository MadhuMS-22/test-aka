import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionsData from '../questions.json';
import QuestionComponent from './QuestionComponent';

const QuizGame = ({ teamName, onQuizComplete }) => {
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [questionTimes, setQuestionTimes] = useState({});
    const [totalScore, setTotalScore] = useState(0);
    const [timer, setTimer] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [showValidation, setShowValidation] = useState(false);
    const [questionOrder, setQuestionOrder] = useState(null);
    const [orderedQuestions, setOrderedQuestions] = useState([]);

    const questions = questionsData.questions;

    // Get question order and create ordered questions array
    const getQuestionOrder = () => {
        if (questionOrder) {
            return questionOrder;
        }
        // Randomly select one of the 5 question orders
        const randomOrderIndex = Math.floor(Math.random() * questionsData.questionOrders.length);
        const selectedOrder = questionsData.questionOrders[randomOrderIndex];
        setQuestionOrder(selectedOrder);
        return selectedOrder;
    };

    // Get ordered questions based on the selected order
    const getOrderedQuestions = () => {
        if (orderedQuestions.length > 0) {
            return orderedQuestions;
        }
        const order = getQuestionOrder();
        const ordered = order.questionIds.map(id =>
            questions.find(q => q.id === id)
        ).filter(Boolean);
        setOrderedQuestions(ordered);
        return ordered;
    };

    // Initialize ordered questions list
    const orderedQuestionsList = getOrderedQuestions();
    const currentQuestion = orderedQuestionsList && orderedQuestionsList[currentQuestionIndex];

    // Maximum possible score (36 puzzle blocks total across all 5 questions)
    const maxPossibleScore = 36;

    useEffect(() => {
        let interval = null;
        if (quizStarted && !quizComplete && currentQuestion) {
            setTimer(currentQuestion.timeLimit);
            setStartTime(Date.now());

            interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        // Auto-save incomplete quiz when timer expires
                        handleIncompleteQuiz();
                        handleNextQuestion();
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizStarted, quizComplete, currentQuestionIndex]);

    // Auto-save when user tries to leave the page
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (quizStarted && !quizComplete) {
                handleIncompleteQuiz();
                e.preventDefault();
                e.returnValue = 'Your quiz progress will be saved. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [quizStarted, quizComplete]);

    // Initialize quiz when component mounts with teamName
    useEffect(() => {
        if (teamName && !quizStarted) {
            // Initialize question order and ordered questions
            getQuestionOrder();
            getOrderedQuestions();

            setQuizStarted(true);
            setQuizComplete(false);
            setCurrentQuestionIndex(0);
            setSelectedAnswers({});
            setQuestionTimes({});
            setTotalScore(0);
            setFeedbackMessage('');
            setStartTime(Date.now());
        }
    }, [teamName]);

    const handleAnswerClick = (questionIndex, blockIndex, option) => {
        if (!quizStarted || quizComplete) return;

        const answerKey = `${questionIndex}-${blockIndex}`;
        setSelectedAnswers({
            ...selectedAnswers,
            [answerKey]: option,
        });

        // Clear validation state when user answers a question
        if (showValidation) {
            setShowValidation(false);
            setFeedbackMessage('');
        }
    };

    const handleNextQuestion = () => {
        // Check if all puzzle blocks in current question are answered
        const currentQuestion = orderedQuestionsList && orderedQuestionsList[currentQuestionIndex];
        if (!currentQuestion) {
            setFeedbackMessage('Error: Question not found. Please refresh and try again.');
            return;
        }

        const unansweredBlocks = currentQuestion.codeBlocks.filter((block, blockIndex) => {
            if (block.isPuzzle) {
                const answerKey = `${currentQuestionIndex}-${blockIndex}`;
                return !selectedAnswers[answerKey];
            }
            return false;
        });

        if (unansweredBlocks.length > 0) {
            setShowValidation(true);
            setFeedbackMessage(`Please answer all puzzle blocks in Question ${currentQuestionIndex + 1} before proceeding.`);
            return;
        }

        // Save time for current question
        const timeTaken = currentQuestion.timeLimit - timer;
        setQuestionTimes({
            ...questionTimes,
            [currentQuestionIndex]: timeTaken
        });

        if (currentQuestionIndex < orderedQuestionsList.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setFeedbackMessage(''); // Clear any previous messages
            setShowValidation(false); // Reset validation state
        } else {
            handleQuizCompletion();
        }
    };

    // Auto-save function for incomplete quizzes
    const handleIncompleteQuiz = async () => {
        if (!teamName.trim()) return;

        // Calculate current score with whatever answers we have
        let currentScore = 0;
        const questionResults = [];
        const individualQuestionScores = [];
        let selectedProgram = '';

        orderedQuestionsList.forEach((question, qIndex) => {
            let questionScore = 0;
            let questionTime = questionTimes[qIndex] || 0;

            question.codeBlocks.forEach((block, bIndex) => {
                if (block.isPuzzle) {
                    const answerKey = `${qIndex}-${bIndex}`;
                    const selectedAnswer = selectedAnswers[answerKey];
                    const isCorrect = selectedAnswer && selectedAnswer.isCorrect;

                    if (isCorrect) {
                        currentScore++;
                        questionScore++;
                    }

                    questionResults.push({
                        questionIndex: qIndex,
                        blockIndex: bIndex,
                        selectedAnswer: selectedAnswer ? selectedAnswer.code : '',
                        isCorrect: isCorrect,
                        timeTaken: questionTime
                    });

                    if (selectedAnswer) {
                        selectedProgram += selectedAnswer.code + '\n';
                    }
                } else {
                    selectedProgram += block.code + '\n';
                }
            });

            individualQuestionScores.push({
                questionIndex: qIndex,
                score: questionScore,
                timeTaken: questionTime
            });
        });

        const totalTimeTaken = Math.floor((Date.now() - startTime) / 1000);

        try {
            const response = await fetch('http://localhost:5000/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamName: teamName,
                    score: currentScore,
                    totalTimeTaken: totalTimeTaken,
                    selectedProgram: selectedProgram,
                    questionOrder: questionOrder.orderId,
                    questionOrderName: questionOrder.name,
                    questionResults: questionResults,
                    individualQuestionScores: individualQuestionScores,
                    date: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                console.log('Incomplete quiz auto-saved successfully');
            }
        } catch (error) {
            console.error('Error auto-saving incomplete quiz:', error);
        }
    };

    const handleQuizCompletion = async () => {
        // Calculate final score
        let newScore = 0;
        const questionResults = [];
        const individualQuestionScores = [];
        let selectedProgram = '';

        orderedQuestionsList.forEach((question, qIndex) => {
            let questionScore = 0;
            let questionTime = questionTimes[qIndex] || 0;

            question.codeBlocks.forEach((block, bIndex) => {
                if (block.isPuzzle) {
                    const answerKey = `${qIndex}-${bIndex}`;
                    const selectedAnswer = selectedAnswers[answerKey];
                    const isCorrect = selectedAnswer && selectedAnswer.isCorrect;

                    if (isCorrect) {
                        newScore++;
                        questionScore++;
                    }

                    questionResults.push({
                        questionIndex: qIndex,
                        blockIndex: bIndex,
                        selectedAnswer: selectedAnswer ? selectedAnswer.code : '',
                        isCorrect: isCorrect,
                        timeTaken: questionTime
                    });

                    if (selectedAnswer) {
                        selectedProgram += selectedAnswer.code + '\n';
                    }
                } else {
                    selectedProgram += block.code + '\n';
                }
            });

            individualQuestionScores.push({
                questionIndex: qIndex,
                score: questionScore,
                timeTaken: questionTime
            });
        });

        setTotalScore(newScore);
        setQuizComplete(true);

        const totalTimeTaken = Math.floor((Date.now() - startTime) / 1000);

        try {
            const response = await fetch('http://localhost:5000/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamName: teamName,
                    score: newScore,
                    totalTimeTaken: totalTimeTaken,
                    selectedProgram: selectedProgram,
                    questionOrder: questionOrder.orderId,
                    questionOrderName: questionOrder.name,
                    questionResults: questionResults,
                    individualQuestionScores: individualQuestionScores,
                    date: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                setFeedbackMessage('Your responses have been successfully submitted!');
            } else {
                setFeedbackMessage('Failed to submit responses. Please try again.');
            }
        } catch (error) {
            console.error('Error saving score:', error);
            setFeedbackMessage('An error occurred while submitting. Please try again.');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (!quizStarted) {
        return null; // This will be handled by the parent component
    }

    if (quizComplete) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 flex flex-col items-center justify-center">
                <div className="w-full max-w-6xl p-8 bg-gray-800 rounded-xl shadow-lg">
                    <div className="text-center">
                        <div className="bg-gray-700 p-8 rounded-lg mb-6">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-3xl font-bold mb-4 text-green-400">Quiz Submitted Successfully!</h2>
                            <p className="text-xl text-gray-300 mb-6">
                                Thank you, <span className="text-indigo-400 font-semibold">{teamName}</span>! Your responses have been recorded.
                            </p>
                            <div className="bg-green-800 border border-green-600 rounded-lg p-4 mb-6">
                                <p className="text-green-200 font-semibold">
                                    🎉 Your quiz has been successfully submitted and saved to the database.
                                </p>
                                <p className="text-green-300 text-sm mt-2">
                                    Results will be available on the admin dashboard.
                                </p>
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setQuizStarted(false);
                                        setQuizComplete(false);
                                        setCurrentQuestionIndex(0);
                                        setSelectedAnswers({});
                                        setQuestionTimes({});
                                        setTotalScore(0);
                                        setFeedbackMessage('');
                                        setShowValidation(false);
                                        setQuestionOrder(null);
                                        setOrderedQuestions([]);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                                >
                                    Take Quiz Again
                                </button>
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                                >
                                    View Admin Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl p-8 bg-gray-800 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-2xl font-bold">
                        Question {currentQuestionIndex + 1} of {orderedQuestionsList ? orderedQuestionsList.length : 0}
                    </div>
                    <div className="text-2xl font-bold">
                        Time Remaining: {formatTime(timer)}
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-6">
                    <div className="flex justify-center space-x-2">
                        {orderedQuestionsList && orderedQuestionsList.map((_, index) => {
                            const hasAnswer = Object.keys(selectedAnswers).some(key => key.startsWith(`${index}-`));
                            const isCurrent = index === currentQuestionIndex;
                            const isCompleted = index < currentQuestionIndex;

                            return (
                                <div
                                    key={index}
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isCurrent ? 'bg-blue-600 text-white' :
                                            isCompleted ? 'bg-green-600 text-white' :
                                                hasAnswer ? 'bg-yellow-500 text-black' :
                                                    'bg-gray-600 text-gray-300'}
                  `}
                                >
                                    {index + 1}
                                </div>
                            );
                        })}
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-400">
                        {Object.keys(selectedAnswers).filter(key => key.startsWith(`${currentQuestionIndex}-`)).length > 0
                            ? 'Answered' : 'Not Answered'}
                    </div>
                </div>

                {/* Validation Message */}
                {feedbackMessage && (
                    <div className="mb-4 p-3 bg-red-800 border border-red-600 rounded-lg">
                        <p className="text-red-200 text-center">{feedbackMessage}</p>
                    </div>
                )}

                {currentQuestion && (
                    <QuestionComponent
                        question={currentQuestion}
                        questionIndex={currentQuestionIndex}
                        selectedAnswers={selectedAnswers}
                        onAnswerClick={handleAnswerClick}
                        quizComplete={quizComplete}
                        showValidation={showValidation}
                    />
                )}

                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                    >
                        Next Question
                    </button>
                    <button
                        onClick={handleQuizCompletion}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                    >
                        Finish Quiz
                    </button>
                </div>

                {/* Auto-save warning */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">
                        💾 Your progress is automatically saved. If you don't finish, your current answers will be recorded.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
