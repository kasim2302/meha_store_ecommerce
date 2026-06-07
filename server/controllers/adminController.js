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

    // Calculate weekly revenue and trend
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const completedThisWeek = await PrePurchase.find({
      status: 'Completed',
      updatedAt: { $gte: sevenDaysAgo }
    });

    const completedLastWeek = await PrePurchase.find({
      status: 'Completed',
      updatedAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });

    const weeklyRevenue = completedThisWeek.reduce((acc, order) => {
      return acc + (order.finalAmount !== null && order.finalAmount !== undefined
        ? order.finalAmount
        : order.totalAmount || 0);
    }, 0);

    const lastWeeklyRevenue = completedLastWeek.reduce((acc, order) => {
      return acc + (order.finalAmount !== null && order.finalAmount !== undefined
        ? order.finalAmount
        : order.totalAmount || 0);
    }, 0);

    let revenueTrend = 0;
    if (lastWeeklyRevenue > 0) {
      revenueTrend = Math.round(((weeklyRevenue - lastWeeklyRevenue) / lastWeeklyRevenue) * 100);
    } else if (weeklyRevenue > 0) {
      revenueTrend = 100;
    }

    // Top 5 Products by reserved quantity
    const topProductsData = await PrePurchase.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQty: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    const topProductsPopulated = await Product.populate(topProductsData, {
      path: '_id',
      select: 'name imageUrl price'
    });

    const topProducts = topProductsPopulated
      .filter(item => item._id)
      .map(item => ({
        _id: item._id._id,
        name: item._id.name,
        imageUrl: item._id.imageUrl,
        price: item._id.price,
        totalQty: item.totalQty
      }));

    res.json({
      totalUsers,
      totalProducts,
      totalReservations,
      totalRevenue,
      weeklyRevenue,
      revenueTrend,
      topProducts,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

