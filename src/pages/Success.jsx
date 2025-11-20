import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");

  // Auto-redirect to My Orders page
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5 flex flex-col items-center text-center">

      {/* Success Icon */}
      <div className="bg-green-100 text-green-600 p-6 rounded-full shadow-md mb-4">
        <svg
          className="w-14 h-14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>

      <p className="text-gray-600 mt-2">
        Your order has been placed successfully.
      </p>

      {orderId && (
        <p className="mt-3 text-lg">
          <strong>Order ID:</strong> {orderId}
        </p>
      )}

      {/* Info / Redirect notice */}
      <p className="text-sm text-gray-500 mt-2">
        Redirecting you to <strong>My Orders</strong>...
      </p>

      {/* Fallback Button */}
      <Link to="/orders" className="btn btn-primary mt-4">
        View My Orders
      </Link>

      <Link to="/" className="btn btn-outline-secondary mt-3">
        Continue Shopping
      </Link>
    </div>
  );
}
