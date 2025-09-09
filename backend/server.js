import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codepuzzle';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Score Schema
const scoreSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalTimeTaken: {
        type: Number,
        required: true
    },
    selectedProgram: {
        type: String,
        required: true
    },
    questionOrder: {
        type: Number,
        required: true
    },
    questionOrderName: {
        type: String,
        required: true
    },
    questionResults: [{
        questionIndex: Number,
        blockIndex: Number,
        selectedAnswer: String,
        isCorrect: Boolean,
        timeTaken: Number
    }],
    individualQuestionScores: [{
        questionIndex: Number,
        score: Number,
        timeTaken: Number
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Score = mongoose.model('Score', scoreSchema);

// API Routes

// POST /api/scores - Save a new score
app.post('/api/scores', async (req, res) => {
    try {
        const { teamName, score, totalTimeTaken, selectedProgram, questionOrder, questionOrderName, questionResults, individualQuestionScores, date } = req.body;

        const newScore = new Score({
            teamName,
            score,
            totalTimeTaken,
            selectedProgram,
            questionOrder,
            questionOrderName,
            questionResults,
            individualQuestionScores,
            date: date || new Date()
        });

        const savedScore = await newScore.save();
        res.status(201).json(savedScore);
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// GET /api/scores - Get all scores
app.get('/api/scores', async (req, res) => {
    try {
        const scores = await Score.find().sort({ date: -1 });
        res.json(scores);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'C Code Puzzle Game API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
