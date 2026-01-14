import axios from 'axios';

const API = axios.create({

  baseURL: process.env.REACT_APP_API_URL || "",
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

export const createCheckoutSession = (customerId) =>
  API.post(`/api/v1/orders/checkout?customerId=${customerId}`);


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
export const fetchCategories = () => API.get("/api/v1/categories");
export const deleteOrderAdmin = (id) => API.delete(`/api/v1/orders/${id}`);
  export const fetchAllOrdersAdmin = () => API.get("/api/v1/orders/admin/orders");
  export const fetchAllCustomersAdmin = () => API.get("/api/v1/customers");

export const updateInventoryQty = (productId, quantity) =>
  API.put(`/api/v1/inventory/product/${productId}?quantity=${quantity}`);
