const { v4: uuidv4 } = require('uuid');
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
} = require('../models/clientModel');

async function handleGetClients(req, res) {
  try {
    const items = await getClients();
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function handleGetClient(req, res) {
  try {
    const item = await getClientById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Client not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function handleCreateClient(req, res) {
  try {
    const client = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    await createClient(client);
    res.status(201).json(client);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function handleUpdateClient(req, res) {
  try {
    await updateClient(req.params.id, req.body);
    const updated = await getClientById(req.params.id);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

async function handleDeleteClient(req, res) {
  try {
    await deleteClient(req.params.id);
    res.json({ message: 'Client removed' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = {
  handleGetClients,
  handleGetClient,
  handleCreateClient,
  handleUpdateClient,
  handleDeleteClient
};
