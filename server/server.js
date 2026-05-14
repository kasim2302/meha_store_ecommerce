import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import prepurchaseRoutes from './routes/prepurchase.js';
import categoryRoutes from './routes/category.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import Category from './models/Category.js';

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prepurchase', prepurchaseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mehastore';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed default categories if empty
    try {
      const count = await Category.countDocuments();
      if (count === 0) {
        const defaultCategories = [
          { name: 'Toys', description: 'Fun toys for all ages' },
          { name: 'Cosmetics', description: 'Beauty products' },
          { name: 'Stationaries', description: 'School and office supplies' },
          { name: 'Gifts', description: 'Perfect items for gifting' },
          { name: 'Fancy', description: 'Fancy accessories and items' },
          { name: 'Covering Jewellers', description: 'Imitation jewelry' }
        ];
        await Category.insertMany(defaultCategories);
        console.log('Seeded default categories');
      }
    } catch (err) {
      console.error('Error seeding categories', err);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
