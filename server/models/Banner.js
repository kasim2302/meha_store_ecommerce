import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  bgColor: { type: String, default: '#3b82f6' }, // tailwind-like blue default
  textColor: { type: String, default: '#ffffff' },
  link: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
