// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/user');
const Quiz = require('../models/quiz');

router.get('/quizzes/count', authenticateUser, isAdmin, async (req, res) => {
  
  try {
    const count = await Quiz.countDocuments();
  
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching quizzes count:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes count.' });
  }
});


router.get('/users/count', authenticateUser, isAdmin, async (req, res) => {
  console.log('Inside /admin-panel-data/users/count route handler');
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({ error: 'Failed to fetch users count.' });
  }
});

router.get('/users', authenticateUser, isAdmin, async (req, res) => {
});

router.delete('/users/:userId', authenticateUser, isAdmin, async (req, res) => {
});

router.get('/profile', authenticateUser, isAdmin, async (req, res) => {
});

router.get('/quizzes/recent', authenticateUser, isAdmin, async (req, res) => {
  console.log('Inside /admin-panel-data/quizzes/recent route handler');
  try {
    const recentQuizzes = await Quiz.find().sort({ createdAt: -1 }).limit(5).select('title');
    console.log('Recent quizzes:', recentQuizzes); 
    res.status(200).json(recentQuizzes);
  } catch (error) {
    console.error('Error fetching recent quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch recent quizzes.' });
  }
});

module.exports = router;