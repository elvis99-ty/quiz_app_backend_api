const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quizRoutes');
const authenticateUser = require('./middleware/authMiddleware');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin/quizzes', quizRoutes);
app.use('/api/quizzes', quizRoutes);

// Mount admin routes AFTER other middleware
app.use('/admin-panel-data', authenticateUser, adminRoutes);

// connect to MongoDb
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    mongoose.set('debug', true);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.get('/', authenticateUser, (req, res) => {
    res.send(`Quiz App Backend is running! Authenticated user: ${req.user.username}`);
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
  



