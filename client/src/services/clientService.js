import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach token to every request if present
api.interceptors.request.use(config => {
  const token = typeof window !== 'undefined' && localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

const clientService = {
  getClients: () => api.get('/clients').then(res => res.data),
  getClient: id => api.get(`/clients/${id}`).then(res => res.data),
  createClient: data => api.post('/clients', data).then(res => res.data),
  updateClient: (id, data) => api.put(`/clients/${id}`, data).then(res => res.data),
  deleteClient: id => api.delete(`/clients/${id}`).then(res => res.data),
};

export default clientService;
