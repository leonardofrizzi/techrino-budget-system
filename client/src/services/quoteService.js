import apiClient from '../api/axios';

export const quoteService = {
  // Get all quotes
  getQuotes: async () => {
    try {
      const response = await apiClient.get('/quotes');
      return response.data;
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw error;
    }
  },
  
  // Get quote by ID
  getQuoteById: async (id) => {
    try {
      const response = await apiClient.get(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error);
      throw error;
    }
  },
  
  // Create new quote
  createQuote: async (quoteData) => {
    try {
      const response = await apiClient.post('/quotes', quoteData);
      return response.data;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  },
  
  // Update quote
  updateQuote: async (id, quoteData) => {
    try {
      const response = await apiClient.put(`/quotes/${id}`, quoteData);
      return response.data;
    } catch (error) {
      console.error(`Error updating quote ${id}:`, error);
      throw error;
    }
  },
  
  // Delete quote
  deleteQuote: async (id) => {
    try {
      const response = await apiClient.delete(`/quotes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting quote ${id}:`, error);
      throw error;
    }
  }
};

export default quoteService;
