import React, { createContext, useState, useContext } from 'react';


const CartContext = createContext();

const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);


  const incrementCartCount = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <CartContext.Provider value={{ cartCount, incrementCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
export { CartProvider, useCart };