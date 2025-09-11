import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for scores
let scores = [];

// API Routes

// POST /api/scores - Save a new score
app.post('/api/scores', async (req, res) => {
    try {
        const { teamName, score, totalTimeTaken, selectedProgram, questionOrder, questionOrderName, questionResults, individualQuestionScores, date } = req.body;

        const newScore = {
            _id: Date.now().toString(), // Simple ID generation
            teamName,
            score,
            totalTimeTaken,
            selectedProgram,
            questionOrder,
            questionOrderName,
            questionResults,
            individualQuestionScores,
            date: date || new Date().toISOString()
        };

        scores.push(newScore);
        res.status(201).json(newScore);
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: 'Failed to save score' });
    }
});

// GET /api/scores - Get all scores
app.get('/api/scores', async (req, res) => {
    try {
        // Sort by score (highest first), then by time (fastest first)
        const sortedScores = scores.sort((a, b) => {
            if (b.score !== a.score) {
                return (b.score || 0) - (a.score || 0);
            }
            return (a.totalTimeTaken || 0) - (b.totalTimeTaken || 0);
        });
        res.json(sortedScores);
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
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Scores API: http://localhost:${PORT}/api/scores`);
});
