const express = require('express');
const router = express.Router();
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} = require('../controllers/quoteController');

router.route('/').get(getQuotes).post(createQuote);
router.route('/:id').get(getQuoteById).put(updateQuote).delete(deleteQuote);

module.exports = router;
