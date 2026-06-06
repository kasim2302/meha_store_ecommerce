import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Cookie options ─────────────────────────────────────────
const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,                          // JS cannot access this cookie
  secure: isProduction,                    // HTTPS only in production
  sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin (Vercel → Render)
  maxAge: 30 * 24 * 60 * 60 * 1000,       // 30 days in ms
};

// Helper: generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Log a clear warning in Render logs — go to Render → Environment and add JWT_SECRET
    console.error('⚠️  WARNING: JWT_SECRET is not set in environment variables!');
  }
  return jwt.sign({ id }, secret || 'meha_super_secret_jwt_key_2026', { expiresIn: '30d' });
};

// Helper: safe user payload (no token — sent via cookie instead)
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ message: 'Name must be at least 3 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    if (user) {
      res.cookie('token', generateToken(user._id), COOKIE_OPTIONS);
      res.status(201).json(safeUser(user));
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.comparePassword(password))) {
      res.cookie('token', generateToken(user._id), COOKIE_OPTIONS);
      res.json(safeUser(user));
    } else {
      // Same generic message for both "user not found" and "wrong password"
      // — prevents user enumeration attacks
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Logout user — clear the auth cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0), // immediately expire the cookie
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(safeUser(user));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Only update name — never allow role to be changed via this endpoint
      if (req.body.name) {
        user.name = req.body.name.trim();
      }

      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        user.password = req.body.password;
      }

      if (req.file) {
        user.profilePicture = req.file.path; // Cloudinary URL
      }

      const updatedUser = await user.save();
      res.cookie('token', generateToken(updatedUser._id), COOKIE_OPTIONS);
      res.json(safeUser(updatedUser));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
