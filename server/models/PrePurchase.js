import mongoose from 'mongoose';

const prePurchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtSelection: { type: Number, required: true } // Store price at the time of pre-purchase
  }],
  status: { type: String, enum: ['Pending', 'Allocated', 'Completed', 'Cancelled'], default: 'Pending' },
  totalAmount: { type: Number, required: true },     // estimated total from website
  finalAmount: { type: Number, default: null }        // actual amount paid at store (set when completing)
}, { timestamps: true });

export default mongoose.model('PrePurchase', prePurchaseSchema);
