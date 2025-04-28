const express = require('express');
const router = express.Router();
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClientById).put(updateClient).delete(deleteClient);

module.exports = router;
