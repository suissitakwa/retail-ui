import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CheckoutButton from "../components/CheckoutButton";

export default function Cart() {
  const { cartItems, isLoading, error, removeFromCart, clearCart } = useCart();

  if (isLoading)
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading your cart…</span>
      </div>
    );

  if (error)
    return (
      <div className="cart-container">
        <div className="error-card">
          <strong>Could not load cart.</strong> Please refresh and try again.
        </div>
      </div>
    );

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Cart</h2>
        {cartItems.length > 0 && (
          <button className="btn-danger" onClick={clearCart}>Clear cart</button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-box">
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</p>
          <p className="empty-title">Your cart is empty</p>
          <p className="empty-subtext">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="add-btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none', padding: '10px 24px', borderRadius: '10px' }}>
            Browse today's deals
          </Link>
        </div>
      ) : (
        <div className="cart-items-list">
          {cartItems.map((item, i) => (
            <div key={item.id || i} className="cart-item">
              <div className="cart-item-info">
                <p className="cart-item-title">{item.name}</p>
                <p className="cart-item-subtext">
                  ${Number(item.price).toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="cart-item-right">
                <span className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.productId ?? item.id)}
                  aria-label="Remove item"
                >✕</button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <span className="summary-label">Order total</span>
            <span className="summary-total">${total.toFixed(2)}</span>
          </div>

          <div className="checkout-row">
            <CheckoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
