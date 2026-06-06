import User from '../models/User.js';
import Product from '../models/Product.js';
import PrePurchase from '../models/PrePurchase.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalReservations = await PrePurchase.countDocuments({});

    // Calculate total revenue: use finalAmount (actual paid) when available,
    // else fall back to totalAmount (estimated)
    const reservations = await PrePurchase.find({ status: 'Completed' });
    const totalRevenue = reservations.reduce((acc, order) => {
      return acc + (order.finalAmount !== null && order.finalAmount !== undefined
        ? order.finalAmount
        : order.totalAmount || 0);
    }, 0);

    // Get low stock products (quantity < 5)
    const lowStockProducts = await Product.find({ quantity: { $lt: 5 } }).limit(10);

    res.json({
      totalUsers,
      totalProducts,
      totalReservations,
      totalRevenue,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
