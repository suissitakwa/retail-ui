import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const timer = setTimeout(() => navigate("/orders"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5 d-flex flex-column align-items-center text-center">

      {/* Success icon */}
      <div className="success-icon mb-4">
        <svg
          width="56" height="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="fw-bold text-success fs-3">
        Payment Successful 🎉
      </h1>

      <p className="text-muted mt-2">
        Your order has been placed successfully.
      </p>

      {orderId && (
        <p className="mt-3">
          <strong>Order ID:</strong> {orderId}
        </p>
      )}

      <p className="text-muted small mt-2">
        Redirecting you to <strong>My Orders</strong> in 5 seconds…
      </p>

      <Link to="/orders" className="btn btn-primary mt-4">
        View My Orders
      </Link>

      <Link to="/" className="btn btn-outline-secondary mt-3">
        Continue Shopping
      </Link>
    </div>
  );
}
