import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, fetchProfile } from '../api';

const CartContext = createContext();

const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // This function is called by the Shop component to update the UI
  const incrementCartCount = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, incrementCartCount }}>
      {children}
    </CartContext.Provider>
  );
};