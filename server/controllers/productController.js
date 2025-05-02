// controllers/productController.js
const Product = require('../models/productModel');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products.map(p => p.toJSON()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product.toJSON());
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, category, specifications, preferredSuppliers, typicalMargin, inStock } = req.body;
    const product = await Product.create({
      name,
      category,
      specifications,
      preferredSuppliers,
      typicalMargin,
      inStock: inStock !== undefined ? inStock : true,
    });
    res.status(201).json(product.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const { name, category, specifications, preferredSuppliers, typicalMargin, inStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name !== undefined ? name : product.name;
    product.category = category !== undefined ? category : product.category;
    product.specifications = specifications !== undefined ? specifications : product.specifications;
    product.preferredSuppliers = preferredSuppliers !== undefined ? preferredSuppliers : product.preferredSuppliers;
    product.typicalMargin = typicalMargin !== undefined ? typicalMargin : product.typicalMargin;
    product.inStock = inStock !== undefined ? inStock : product.inStock;

    const updated = await product.save();
    res.json(updated.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product removed', id: product.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
