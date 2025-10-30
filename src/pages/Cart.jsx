import React, { useEffect, useState } from 'react';
import { fetchCart } from '../api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart() // Now automatically includes token
      .then(res => setCartItems(res.data.items || []))
      .catch(err => console.error('Failed to fetch cart', err));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="list-group">
          {cartItems.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              {item.name}
              <span>${item.price} x {item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
