import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const defaultBaseURL = isDev
  ? 'http://localhost:8080'
  : '';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultBaseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  return API.post('/auth/login', { email, password });
};

export const updateProfile = (data) =>
  API.put('/api/v1/customers/me', data);

export const createCheckoutSession = () =>
  API.post('/api/v1/checkout/create-session');

export const register = async (data) => {
  return API.post('/auth/register', data);
};

export const fetchMyOrders = (page = 0, size = 10) => {
  return API.get(`/api/v1/orders/my-orders?page=${page}&size=${size}`);
};

export const fetchProducts = () => API.get('/api/v1/products');
export const fetchProfile = () => API.get('/api/v1/customers/me');
export const fetchCart = () => API.get('/api/v1/cart');
export const removeFromCart = (productId) =>
  API.delete(`/api/v1/cart/remove/${productId}`);

export const addToCart = (productId, quantity) =>
  API.post('/api/v1/cart/add', { productId, quantity });

export const clearCart = () => API.delete('/api/v1/cart/clear');
export const createProductAdmin = (data) =>
  API.post("/api/v1/products", data);

export const deleteProductAdmin = (id) =>
  API.delete(`/api/v1/products/${id}`);


  export const fetchAllOrdersAdmin = () => API.get("/api/v1/orders/admin/orders");
  export const fetchAllCustomersAdmin = () => API.get("/api/v1/customers");
