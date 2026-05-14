import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mehastore';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    const adminExists = await User.findOne({ email: 'admin@mehastore.com' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const adminUser = new User({
      name: 'MEHA Admin',
      email: 'admin@mehastore.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    process.exit();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });
