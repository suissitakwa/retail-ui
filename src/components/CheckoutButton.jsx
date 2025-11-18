import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      const res = await axios.post(
        `http://localhost:8080/api/v1/orders/checkout?customerId=${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.href = res.data.redirectUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Please login and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-8 py-3 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200 w-full md:w-auto"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Redirecting..." : "Proceed to Checkout"}
    </button>
  );
}
