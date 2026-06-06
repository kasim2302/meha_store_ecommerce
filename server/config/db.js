import mongoose from 'mongoose';
import Category from '../models/Category.js';

const seedDefaultCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: 'Toys', description: 'Fun toys for all ages' },
        { name: 'Cosmetics', description: 'Beauty products' },
        { name: 'Stationaries', description: 'School and office supplies' },
        { name: 'Gifts', description: 'Perfect items for gifting' },
        { name: 'Fancy', description: 'Fancy accessories and items' },
        { name: 'Covering Jewellers', description: 'Imitation jewelry' },
      ];
      await Category.insertMany(defaultCategories);
      console.log('✅ Seeded default categories');
    }
  } catch (err) {
    console.error('❌ Error seeding categories:', err);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mehastore');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultCategories();
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
