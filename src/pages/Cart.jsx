import React from "react";
import { useCart } from "../context/CartContext.jsx";
import CheckoutButton from "../components/CheckoutButton";

export default function Cart() {
  const { cartItems, isLoading, error, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return (
      <div className="loading-center">
        <div className="spinner"></div>
        <p className="text-muted">Loading cart contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-card">
        <p><strong>Error:</strong> Failed to load cart data. Please try again.</p>
      </div>
    );
  }

  const totalCost = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      {/* Header */}
      <div className="cart-header">
        <h2>Your Shopping Cart</h2>

        {cartItems.length > 0 && (
          <button className="btn-danger" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="cart-empty-box">
          <p className="empty-title">Your cart is currently empty.</p>
          <p className="empty-subtext">Start adding some items to see them here!</p>
        </div>
      ) : (
        <div className="cart-items-list">
          {cartItems.map((item, index) => (
            <div key={item.id || index} className="cart-item">
              <div className="cart-item-info">
                <p className="cart-item-title">{item.name}</p>
                <p className="cart-item-subtext">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              <div className="cart-item-right">
                <span className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.productId ?? item.id)}
                >
                  ✖
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="cart-summary">
            <span className="summary-label">Subtotal:</span>
            <span className="summary-total">${totalCost.toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <div className="checkout-row">
            <CheckoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
