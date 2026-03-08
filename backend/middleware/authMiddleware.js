const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required: Token missing' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Contains userId, email, fullName etc.

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Authentication failed: Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication failed: Token expired' });
    }
    return res.status(500).json({ message: 'Server error during authentication', error: err.message });
  }
};

module.exports = authMiddleware;
