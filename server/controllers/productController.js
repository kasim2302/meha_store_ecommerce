import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    const imageUrl = req.file ? req.file.path : req.body.imageUrl;

    // ── Input validation ─────────────────────────────────────
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description and category are required' });
    }
    const parsedPrice = parseFloat(price);
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    if (isNaN(parsedQty) || parsedQty < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative integer' });
    }
    if (!imageUrl) {
      return res.status(400).json({ message: 'Product image is required' });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      quantity: parsedQty,
      category,
      imageUrl,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ── Input validation ─────────────────────────────────────
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
      }
      product.price = parsedPrice;
    }
    if (quantity !== undefined) {
      const parsedQty = parseInt(quantity, 10);
      if (isNaN(parsedQty) || parsedQty < 0) {
        return res.status(400).json({ message: 'Quantity must be a non-negative integer' });
      }
      product.quantity = parsedQty;
    }
    if (name)        product.name        = name.trim();
    if (description) product.description = description.trim();
    if (category)    product.category    = category;
    if (imageUrl)    product.imageUrl    = imageUrl;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
