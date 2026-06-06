import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import { connectCloudinary } from './config/cloudinary.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import prepurchaseRoutes from './routes/prepurchase.js';
import categoryRoutes from './routes/category.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Initialize external services
connectCloudinary();

// Connect to database
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://meha-store-ecommerce.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser()); // parse incoming cookies

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prepurchase', prepurchaseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
