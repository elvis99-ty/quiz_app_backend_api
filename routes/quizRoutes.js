const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');
const Quiz = require('../models/quiz');
const Question = require('../models/question'); 

router.get('/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).populate({
      path: 'questions',
      select: 'questionText options', 
    }).select('title questions'); 

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found.' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ error: 'Failed to fetch quiz details.' });
  }
});


router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('_id title'); 
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }
});

router.post('/', authenticateUser, isAdmin, async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Title and at least one question are required.' });
    }

    const newQuiz = new Quiz({
      title,
      createdBy: req.user._id, 
    });

    const savedQuiz = await newQuiz.save();

    const createdQuestions = await Promise.all(
      questions.map(async (questionData) => {
        const newQuestion = new Question({
          questionText: questionData.questionText,
          options: questionData.options,
          correctAnswerIndex: questionData.correctAnswerIndex,
          quiz: savedQuiz._id,
        });
        return await newQuestion.save();
      })
    );

    savedQuiz.questions = createdQuestions.map(q => q._id);
    await savedQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully!', quizId: savedQuiz._id });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz.' });
  }
});

module.exports = router;