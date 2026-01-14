import React, { useState } from 'react';
//import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession } from "../api";
export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();


  const handleCheckout = async () => {
    try {
      setLoading(true);

      //const token = localStorage.getItem("accessToken");

      const res = await createCheckoutSession(user.id);

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
      className="btn-amazon-checkout"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Redirecting..." : "Proceed to Checkout"}
    </button>
  );
}
