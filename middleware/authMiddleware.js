const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid user.' });
      }
      
      req.user = user;
      next();

    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
  } else {
    return res.status(401).json({ error: 'Unauthorized: Token not provided.' });
  }
};

module.exports = authenticateUser;