// src/api/index.js

import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
});

export const fetchProducts = () => API.get('/api/v1/products');
export const fetchProfile = () => API.get('/api/v1/customers/me');
export const fetchCart = (customerId) => API.get(`/api/v1/cart/${customerId}`);
export const addToCart = (productId, quantity = 1) => {
  return API.post('/api/v1/cart/${customerId}/add', {
    productId,
    quantity
  });
};