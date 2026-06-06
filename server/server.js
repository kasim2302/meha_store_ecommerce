import dotenv from 'dotenv';
dotenv.config(); // ← MUST be first so all process.env vars are available

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import { connectCloudinary } from './config/cloudinary.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import prepurchaseRoutes from './routes/prepurchase.js';
import categoryRoutes from './routes/category.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';

// Initialize external services
connectCloudinary();

// Connect to database
connectDB();

const app = express();

// ── Security Headers (helmet) ───────────────────────────────
// Sets X-Content-Type-Options, X-Frame-Options, HSTS, etc.
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://meha-store-ecommerce.vercel.app',
    'https://meha-store-ecommerce-qgczaieqx-mohamed-kasims-projects.vercel.app',
  ],
  credentials: true,
}));

// ── Body Parsing (limit 10kb to block large-payload attacks) ─
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Cookie Parser ───────────────────────────────────────────
app.use(cookieParser());

// ── NoSQL Injection Sanitization ────────────────────────────
// Strips $ and . from req.body, req.query, req.params
app.use(mongoSanitize());

// ── Rate Limiting ───────────────────────────────────────────
// General API limiter: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes: 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prepurchase', prepurchaseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ── Global Error Handler ────────────────────────────────────
// Never leak internal error.message to the client in production
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: isDev ? err.message : 'Something went wrong. Please try again.',
  });
});

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
