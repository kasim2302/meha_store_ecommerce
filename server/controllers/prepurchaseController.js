import PrePurchase from '../models/PrePurchase.js';

// @desc    Create new pre-purchase reservation
// @route   POST /api/prepurchase
// @access  Private
export const createPrePurchase = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No pre-purchase items' });
    }

    // Validate totalAmount
    const parsedTotal = parseFloat(totalAmount);
    if (isNaN(parsedTotal) || parsedTotal < 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    const prePurchase = new PrePurchase({
      user: req.user._id,
      items,
      totalAmount: parsedTotal,
    });

    const createdPrePurchase = await prePurchase.save();
    res.status(201).json(createdPrePurchase);
  } catch (error) {
    console.error('createPrePurchase error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Get logged in user pre-purchases
// @route   GET /api/prepurchase/my-reservations
// @access  Private
export const getMyPrePurchases = async (req, res) => {
  try {
    const prePurchases = await PrePurchase.find({ user: req.user._id }).populate(
      'items.product',
      'name imageUrl price'
    );
    res.json(prePurchases);
  } catch (error) {
    console.error('getMyPrePurchases error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Get all pre-purchases
// @route   GET /api/prepurchase
// @access  Private/Admin
export const getAllPrePurchases = async (req, res) => {
  try {
    const prePurchases = await PrePurchase.find({})
      .populate('user', 'id name email')
      .populate('items.product', 'name');
    res.json(prePurchases);
  } catch (error) {
    console.error('getAllPrePurchases error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Update pre-purchase status
// @route   PUT /api/prepurchase/:id/status
// @access  Private/Admin
export const updatePrePurchaseStatus = async (req, res) => {
  try {
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    const { status, finalAmount } = req.body;

    // Validate status value against whitelist
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const prePurchase = await PrePurchase.findById(req.params.id);
    if (!prePurchase) {
      return res.status(404).json({ message: 'Pre-purchase not found' });
    }

    if (status) prePurchase.status = status;

    if (finalAmount !== undefined && finalAmount !== null) {
      const parsedFinal = parseFloat(finalAmount);
      if (isNaN(parsedFinal) || parsedFinal < 0) {
        return res.status(400).json({ message: 'Invalid final amount' });
      }
      prePurchase.finalAmount = parsedFinal;
    }

    const updatedPrePurchase = await prePurchase.save();
    res.json(updatedPrePurchase);
  } catch (error) {
    console.error('updatePrePurchaseStatus error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
