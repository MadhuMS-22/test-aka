# C Code Puzzle Game - MERN Stack

A web-based interactive C programming quiz game built with the MERN stack (MongoDB, Express.js, React, Node.js). Test your C programming skills with randomized question orders and real-time scoring.

## 🚀 Features

- **Interactive C Programming Quiz** - 5 challenging C programming questions
- **Randomized Question Orders** - 5 different question sequences to prevent cheating
- **Real-time Timer** - 5-minute timer for each question
- **Auto-save Functionality** - Progress saved automatically
- **Admin Dashboard** - View all team submissions and scores
- **Error Highlighting** - Visual feedback for correct/incorrect answers
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
my-app/
├── backend/                 # Backend API server
│   ├── server.js           # Express server setup
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend dependencies
├── src/                    # Frontend React app
│   ├── App.jsx            # Main React component
│   ├── questions.json     # Quiz questions and orders
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/codepuzzle
   PORT=5000
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## 🎮 How to Play

1. **Enter Team Name** - Start by entering your team name
2. **Answer Questions** - Complete 5 C programming questions
3. **Timer** - Each question has a 5-minute time limit
4. **Submit** - Click "Finish Quiz" when done
5. **View Results** - Check your score in the admin dashboard

## 🔧 Admin Features

- **View All Teams** - See all team submissions
- **Score Rankings** - Teams ranked by score and time
- **Question Order Display** - See which order each team received
- **Program Review** - View submitted code with error highlighting
- **Individual Scores** - Detailed breakdown per question

## 📊 Question Orders

The system uses 5 different question orders to ensure fairness:

- **Order A**: Questions 1, 2, 3, 4, 5
- **Order B**: Questions 2, 4, 1, 5, 3
- **Order C**: Questions 3, 1, 5, 2, 4
- **Order D**: Questions 4, 5, 2, 3, 1
- **Order E**: Questions 5, 3, 4, 1, 2

## 🗄️ Database Schema

### Score Collection
```javascript
{
  teamName: String,
  score: Number,
  totalTimeTaken: Number,
  selectedProgram: String,
  questionOrder: Number,
  questionOrderName: String,
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
  date: Date
}
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `backend` folder
3. Update API URLs in frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in backend `.env` file
   - Update frontend API calls

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Happy Coding! 🎉**
