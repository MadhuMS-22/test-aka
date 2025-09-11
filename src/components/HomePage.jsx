import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onStartQuiz, teamName, setTeamName, feedbackMessage }) => {
    const navigate = useNavigate();

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl p-8 bg-gray-800 rounded-xl shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-indigo-400">
                    C Code Logic Match
                </h1>
                <p className="text-xl text-center mb-8 text-gray-300">
                    Complete 5 C programming puzzles. Each question has a 5-minute timer.
                </p>

                <div className="text-center">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">C Code Puzzle Game</h2>
                        <p className="text-lg text-gray-300 mb-6">
                            Test your C programming skills with 5 challenging puzzles!
                        </p>
                        <div className="bg-gray-700 p-6 rounded-lg mb-6">
                            <h3 className="text-xl font-bold text-indigo-400 mb-4">Game Rules:</h3>
                            <ul className="text-left text-gray-300 space-y-2">
                                <li>• Complete 5 different C programming puzzles</li>
                                <li>• Each question has a 5-minute time limit</li>
                                <li>• Select the correct code blocks to complete each program</li>
                                <li>• Your progress and answers will be saved automatically</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-lg font-semibold mb-2 text-gray-300">
                            Enter Team Name:
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="Enter your team name..."
                            className="w-full max-w-md mx-auto px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
                        />
                        {feedbackMessage && (
                            <p className="text-red-400 mt-2">{feedbackMessage}</p>
                        )}
                    </div>
                    <p className="mb-4 text-xl">Ready to start? Each question has {formatTime(300)} to solve. Good luck!</p>
                    <button
                        onClick={onStartQuiz}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                    >
                        Start Quiz
                    </button>
                    <button
                        onClick={() => navigate('/admin')}
                        className="mt-4 ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
                    >
                        View Admin Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
