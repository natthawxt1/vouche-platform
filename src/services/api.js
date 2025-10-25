import axios from 'axios';
//รอของกาย 
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Products
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');

// Orders
export const getUserOrders = (userId) => api.get(`/orders/user/${userId}`);
export const createOrder = (orderData) => api.post('/orders', orderData);

// Gift Codes
export const getGiftCode = (code) => api.get(`/giftcodes/${code}`);

export default api;