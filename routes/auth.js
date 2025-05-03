const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists.' });
    }

    const newUser = new User({ username, email, password, role: 'user' }); // Default role is 'user'
    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({ message: 'Signup successful!', userId: newUser._id, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful!', token, userId: user._id, username: user.username, role: user.role }); // Include the role here
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login.' });
  }
});

// POST /api/auth/logout  <--- Add this route
router.post('/logout', (req, res) => {
  // For a simple JWT implementation, the server doesn't need to do much.
  // The client-side (frontend) will clear the token.
  res.status(200).json({ message: 'Logout successful' });
  // If you had server-side sessions or token blacklisting, you'd add that logic here.
});

module.exports = router;