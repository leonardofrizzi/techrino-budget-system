const Quote = require('../models/quoteModel');
const Client = require('../models/clientModel');
const Product = require('../models/productModel');

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Public
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({})
      .populate('client', 'name company email')
      .populate('items.product', 'name price');
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quote by ID
// @route   GET /api/quotes/:id
// @access  Public
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('client', 'name company email phone')
      .populate('items.product', 'name description price category');

    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: 'Quote not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a quote
// @route   POST /api/quotes
// @access  Public
const createQuote = async (req, res) => {
  try {
    const {
      client: clientId,
      items,
      status,
      validUntil,
      notes,
    } = req.body;

    // Check if client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(400).json({ message: 'Client not found' });
    }

    // Generate a unique quote number (you can customize this)
    const date = new Date();
    const quoteNumber = `QT-${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(
      Math.random() * 1000
    ).toString().padStart(3, '0')}`;

    // Validate and calculate items
    let totalAmount = 0;
    const quoteItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      // Use the product price if item price is not provided
      const price = item.price || product.price;
      
      quoteItems.push({
        product: item.product,
        quantity: item.quantity,
        price: price,
      });

      totalAmount += price * item.quantity;
    }

    // Set validUntil date (default to 30 days from now if not provided)
    const validUntilDate = validUntil ? new Date(validUntil) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const quote = await Quote.create({
      client: clientId,
      quoteNumber,
      items: quoteItems,
      totalAmount,
      status: status || 'pending',
      validUntil: validUntilDate,
      notes,
    });

    const populatedQuote = await Quote.findById(quote._id)
      .populate('client', 'name company email')
      .populate('items.product', 'name');

    res.status(201).json(populatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update quote
// @route   PUT /api/quotes/:id
// @access  Public
const updateQuote = async (req, res) => {
  try {
    const {
      items,
      status,
      validUntil,
      notes,
    } = req.body;

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    // Update items if provided
    if (items && items.length > 0) {
      let totalAmount = 0;
      const quoteItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.product} not found` });
        }

        const price = item.price || product.price;
        
        quoteItems.push({
          product: item.product,
          quantity: item.quantity,
          price: price,
        });

        totalAmount += price * item.quantity;
      }

      quote.items = quoteItems;
      quote.totalAmount = totalAmount;
    }

    // Update other fields if provided
    if (status) quote.status = status;
    if (validUntil) quote.validUntil = new Date(validUntil);
    if (notes !== undefined) quote.notes = notes;

    const updatedQuote = await quote.save();

    const populatedQuote = await Quote.findById(updatedQuote._id)
      .populate('client', 'name company email')
      .populate('items.product', 'name');

    res.json(populatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Public
const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    await quote.deleteOne();
    res.json({ message: 'Quote removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};
