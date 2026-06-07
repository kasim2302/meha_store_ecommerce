import express from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get active banners for the frontend homepage
router.get('/', getActiveBanners);

// Admin-only routes for management
router.get('/admin', protect, admin, getAllBanners);
router.post('/', protect, admin, createBanner);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

export default router;
