import express from 'express';
import {
  createPrePurchase,
  getMyPrePurchases,
  getAllPrePurchases,
  updatePrePurchaseStatus,
} from '../controllers/prepurchaseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPrePurchase);
router.get('/my-reservations', protect, getMyPrePurchases);
router.get('/', protect, admin, getAllPrePurchases);
router.put('/:id/status', protect, admin, updatePrePurchaseStatus);

export default router;
