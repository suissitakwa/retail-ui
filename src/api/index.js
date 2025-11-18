    import axios from 'axios';
    const API = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    });
    API.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    export const login = async (email, password) => {
      return API.post('/auth/login', {
        email,
        password,
      });
    };
export const createCheckoutSession = () =>
  API.post('/api/v1/checkout/create-session');
    export const register = async (data) => {
      return API.post('/auth/register', data);
    };
    export const fetchProducts = () => API.get('/api/v1/products');
    export const fetchProfile = () => API.get('/api/v1/customers/me');
    export const fetchCart = () => API.get('/api/v1/cart');
    export const removeFromCart = (productId) =>
      API.delete(`/api/v1/cart/remove/${productId}`);

    export const addToCart = (productId, quantity) =>
      API.post('/api/v1/cart/add', { productId, quantity });
    export const clearCart = () => {
        return API.delete('/api/v1/cart/clear');
      };