import PrePurchase from '../models/PrePurchase.js';

// @desc    Create new pre-purchase reservation
// @route   POST /api/prepurchase
// @access  Private
export const createPrePurchase = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Bug 4 fix: correct logic — catches null/undefined/empty
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No pre-purchase items provided' });
    }

    // Validate totalAmount is a positive number
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update pre-purchase status
// @route   PUT /api/prepurchase/:id/status
// @access  Private/Admin
export const updatePrePurchaseStatus = async (req, res) => {
  // Fix validation whitelist to match Mongoose schema casing and allowed values
  const VALID_STATUSES = ['Pending', 'Allocated', 'Completed', 'Cancelled'];
  if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {

    return res.status(400).json({
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    });
  }

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
};

// @desc    Cancel a pre-purchase (user cancels their own Pending reservation)
// @route   DELETE /api/prepurchase/:id
// @access  Private
export const cancelPrePurchase = async (req, res) => {
  try {
    const prePurchase = await PrePurchase.findById(req.params.id);
    if (!prePurchase) return res.status(404).json({ message: 'Reservation not found' });

    if (prePurchase.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorised to cancel this reservation' });
    }

    if (prePurchase.status !== 'Pending') {
      return res.status(400).json({ message: `Cannot cancel a reservation with status "${prePurchase.status}"` });
    }

    prePurchase.status = 'Cancelled';
    await prePurchase.save();
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
