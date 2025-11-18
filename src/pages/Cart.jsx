import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { createCheckoutSession } from "../api";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutButton from '../components/CheckoutButton';


export default function Cart() {

  const {
    cartItems,
    isLoading,
    error,
    removeFromCart,
    clearCart
  } = useCart();


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-gray-600">Loading cart contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
        <p className="font-bold">Error:</p>
        <p>Failed to load cart data. Please try again.</p>
      </div>
    );
  }


  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-8">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-extrabold text-gray-900">Your Shopping Cart</h2>
        {/* Clear Cart Button (only visible if items exist) */}
        {cartItems.length > 0 && (
          <button
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-150 text-sm md:text-base"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-xl text-gray-500 font-medium">
            Your cart is currently empty.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Start adding some items to see them here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* List of Cart Items */}
          {/* FIXED WARNING: Added index as a fallback key (key={item.id || index})
            to ensure uniqueness, as cart items (line items) may share the same product ID.
          */}
          {cartItems.map((item, index) => (
            <div
              key={item.id || index}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
            >
              <div className="flex-1 min-w-0 mb-2 md:mb-0">
                <p className="text-lg font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
                <span className="text-xl font-bold text-indigo-600">
                  Total: ${(item.price * item.quantity).toFixed(2)}
                </span>

                {/* Remove Item Button */}
                <button
                  className="p-2 text-sm text-red-500 border border-red-300 rounded-full hover:bg-red-50 transition duration-150 flex-shrink-0"
                  // Using item.productId if available, otherwise falling back to item.id
                  onClick={() => removeFromCart(item.productId ?? item.id)}
                  title="Remove one item from cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="flex justify-between items-center mt-6 p-4 border-t-2 border-indigo-100 bg-indigo-50 rounded-lg shadow-inner">
            <span className="text-xl font-semibold text-gray-700">Subtotal:</span>
            <span className="text-3xl font-extrabold text-indigo-700">
              ${totalCost.toFixed(2)}
            </span>
          </div>

          <div className="mt-6 flex justify-end">

              <CheckoutButton />

          </div>
        </div>
      )}
    </div>
  );
}