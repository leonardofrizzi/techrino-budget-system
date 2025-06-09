const express = require('express');
const {
  handleGetClients,
  handleGetClient,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient
} = require('../controllers/clientController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router
  .route('/')
  .get(handleGetClients)
  .post(handleCreateClient);

router
  .route('/:id')
  .get(handleGetClient)
  .put(handleUpdateClient)
  .delete(handleDeleteClient);

module.exports = router;
