// controllers/clientController.js
const Client = require('../models/clientModel');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    // transform via toJSON virtuals
    const result = clients.map(c => c.toJSON());
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
// @access  Public
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (client) {
      res.json(client.toJSON());
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a client
// @route   POST /api/clients
// @access  Public
const createClient = async (req, res) => {
  try {
    const { name, company, email, phone, status } = req.body;

    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }

    const client = await Client.create({
      name,
      company,
      email,
      phone,
      status: status || 'active',
    });

    res.status(201).json(client.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Public
const updateClient = async (req, res) => {
  try {
    const { name, company, email, phone, status } = req.body;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.name = name !== undefined ? name : client.name;
    client.company = company !== undefined ? company : client.company;
    client.email = email !== undefined ? email : client.email;
    client.phone = phone !== undefined ? phone : client.phone;
    client.status = status !== undefined ? status : client.status;

    const updatedClient = await client.save();
    res.json(updatedClient.toJSON());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Public
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.deleteOne();
    res.json({ message: 'Client removed', id: client.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
