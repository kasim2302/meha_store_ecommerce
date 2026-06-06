import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  // Read token from httpOnly cookie instead of Authorization header
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'meha_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // 403 Forbidden is more accurate than 401 here
    res.status(403).json({ message: 'Access denied: admin only' });
  }
};
