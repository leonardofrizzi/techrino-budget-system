// services/clientService.js
import axios from 'axios';

// Base axios configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`[Response] Status: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[Response Error] Status: ${error.response.status}`, error.response.data);
    } else if (error.request) {
      console.error('[Response Error] No response received', error.request);
    } else {
      console.error('[Error]', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Client service for CRUD operations.
 * Assumes backend returns JSON with `id` field (via toJSON transform).
 */

const clientService = {
  /** Fetch all clients */
  async getClients() {
    const response = await api.get('/clients');
    return response.data; // Array of clients with { id, name, company, email, phone, status }
  },

  /** Fetch client by ID */
  async getClient(id) {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  /** Create a new client */
  async createClient(clientData) {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  /** Update client by ID */
  async updateClient(id, clientData) {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  /** Delete client by ID */
  async deleteClient(id) {
    await api.delete(`/clients/${id}`);
    return id;
  }
};

export default clientService;
