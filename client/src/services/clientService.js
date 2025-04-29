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
  config => {
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log(`[Response] Status: ${response.status} from ${response.config.url}`);
    return response;
  },
  error => {
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

const clientService = {
  async getClients() {
    try {
      const response = await api.get('/clients');
      console.log('Clients data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      
      // Specific check for CORS errors
      if (error.message && error.message.includes('Network Error')) {
        console.error('CORS issue detected. Make sure your backend has proper CORS headers.');
        console.error('Try adding the following to your backend Express app:');
        console.error(`
          app.use(cors({
            origin: 'http://localhost:3000', // Your frontend URL
            credentials: true
          }));
        `);
      }
      
      throw error;
    }
  },

  async getClient(id) {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  async createClient(clientData) {
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  async updateClient(id, clientData) {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  },

  async deleteClient(id) {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  }
};

export default clientService;
