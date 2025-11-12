import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

import { useAuth } from '../context/AuthContext.jsx';
import {
    fetchCart,
    addToCart as apiAddToCart,
    removeFromCart as apiRemoveFromCart,
    clearCart as apiClearCart
} from '../api/index.js';



const CartContext = createContext();

/**
 * Custom hook to consume the Cart context easily in any component.
 */
export const useCart = () => useContext(CartContext);

/**
 * Provides the cart state and actions to the entire application.
 * Dependencies: useAuth (from AuthContext) and API functions (from api/index.js).
 */
export const CartProvider = ({ children }) => {
  // Get the current user from the AuthContext
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetches the current cart state from the backend.
   */
  const refreshCart = useCallback(async () => {
    // If no user is logged in, clear the cart state
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Call the external API function
      const res = await fetchCart();
      // Ensure the response data structure matches expected format
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      // Set a user-friendly error message
      setError("Failed to load cart data. Please check your connection and authentication.");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency on 'user' ensures refresh on login/logout

  // Load cart on component mount or when user authentication state changes
  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);


  // --- Cart Modification Logic ---

  /**
   * Centralized handler for all cart modifications.
   */
  const handleAction = async (action, productId, quantity = 1) => {
    if (!user) {
        console.warn(`Cart action (${action}) blocked: User not authenticated.`);
        return;
    }
    setIsLoading(true);
    setError(null);

    try {
        let res;
        if (action === 'ADD') {
            res = await apiAddToCart(productId, quantity);
        } else if (action === 'REMOVE') {
            // This endpoint removes one item (or the product entirely, depending on backend logic)
            res = await apiRemoveFromCart(productId);
        } else if (action === 'CLEAR') {
            await apiClearCart();
            setCartItems([]);
            setIsLoading(false);
            return;
        }

        // Update state from the new cart data returned by the backend
        if (res && res.data && res.data.items) {
            setCartItems(res.data.items);
        } else {
             // Fallback refresh in case the API response is minimal
             await refreshCart();
        }
    } catch (err) {
      console.error(`Failed to execute ${action} cart action:`, err);
      setError(`Could not execute ${action} action. Please try again.`);
      // If action failed, refresh cart to revert any optimistic UI changes
      refreshCart();
    } finally {
      setIsLoading(false);
    }
  };


  // Public functions exposed by the context
  const addToCart = (productId, quantity = 1) => handleAction('ADD', productId, quantity);
  const removeFromCart = (productId) => handleAction('REMOVE', productId);
  const clearCart = () => handleAction('CLEAR');
 const incrementCartCount = (productId, quantity = 1) => addToCart(productId, quantity);


  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);


  const contextValue = {
    cartItems,
    isLoading,
    error,
    totalItems,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart,
    incrementCartCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};