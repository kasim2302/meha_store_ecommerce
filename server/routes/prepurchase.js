import express from 'express';
import PrePurchase from '../models/PrePurchase.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new pre-purchase reservation
// @route   POST /api/prepurchase
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No pre-purchase items' });
    } else {
      const prePurchase = new PrePurchase({
        user: req.user._id,
        items,
        totalAmount,
      });

      const createdPrePurchase = await prePurchase.save();
      res.status(201).json(createdPrePurchase);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user pre-purchases
// @route   GET /api/prepurchase/my-reservations
// @access  Private
router.get('/my-reservations', protect, async (req, res) => {
  try {
    const prePurchases = await PrePurchase.find({ user: req.user._id }).populate('items.product', 'name imageUrl price');
    res.json(prePurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all pre-purchases
// @route   GET /api/prepurchase
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const prePurchases = await PrePurchase.find({}).populate('user', 'id name email').populate('items.product', 'name');
    res.json(prePurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update pre-purchase status
// @route   PUT /api/prepurchase/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const prePurchase = await PrePurchase.findById(req.params.id);

    if (prePurchase) {
      prePurchase.status = req.body.status || prePurchase.status;
      // Save the actual amount paid at store when provided (e.g., after negotiation)
      if (req.body.finalAmount !== undefined && req.body.finalAmount !== null) {
        prePurchase.finalAmount = Number(req.body.finalAmount);
      }
      const updatedPrePurchase = await prePurchase.save();
      res.json(updatedPrePurchase);
    } else {
      res.status(404).json({ message: 'Pre-purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
