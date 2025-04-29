const Quote   = require('../models/quoteModel');
const Client  = require('../models/clientModel');
const Product = require('../models/productModel');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Public (ou Private, se preferir autenticar)
const getDashboardStats = async (req, res) => {
  try {
    // Pega total de documentos de cada coleção
    const [totalQuotes, totalClients, totalProducts] = await Promise.all([
      Quote.countDocuments(),
      Client.countDocuments(),
      Product.countDocuments(),
    ]);

    // Soma o valor total de todas as cotações
    const revenueAgg = await Quote.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.json({
      totalQuotes,
      totalClients,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
