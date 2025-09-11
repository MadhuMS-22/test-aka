import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizGame from './components/QuizGame';
import AdminPage from './components/AdminPage';

export default function App() {
    const [teamName, setTeamName] = useState('');
    const [quizStarted, setQuizStarted] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleStartQuiz = () => {
        if (!teamName.trim()) {
            setFeedbackMessage('Please enter a team name before starting the quiz.');
            return;
        }
        setQuizStarted(true);
        setFeedbackMessage('');
    };

    const handleQuizComplete = () => {
        setQuizStarted(false);
        setTeamName('');
        setFeedbackMessage('');
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            !quizStarted ? (
                                <HomePage
                                    onStartQuiz={handleStartQuiz}
                                    teamName={teamName}
                                    setTeamName={setTeamName}
                                    feedbackMessage={feedbackMessage}
                                />
                            ) : (
                                <QuizGame
                                    teamName={teamName}
                                    onQuizComplete={handleQuizComplete}
                                />
                            )
                        }
                    />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </div>
        </Router>
    );
}
