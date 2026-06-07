import Banner from '../models/Banner.js';

// @desc    Get active banners for public homepage
// @route   GET /api/banners
// @access  Public
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all banners (Admin only)
// @route   GET /api/banners/admin
// @access  Private/Admin
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new banner (Admin only)
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, bgColor, textColor, link, isActive } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Banner title is required' });
    }
    const banner = new Banner({
      title,
      subtitle,
      bgColor,
      textColor,
      link,
      isActive: isActive !== undefined ? isActive : true
    });
    const savedBanner = await banner.save();
    res.status(201).json(savedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update banner (Admin only)
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
  try {
    const { title, subtitle, bgColor, textColor, link, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (bgColor !== undefined) banner.bgColor = bgColor;
    if (textColor !== undefined) banner.textColor = textColor;
    if (link !== undefined) banner.link = link;
    if (isActive !== undefined) banner.isActive = isActive;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete banner (Admin only)
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    await banner.deleteOne();
    res.json({ message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
