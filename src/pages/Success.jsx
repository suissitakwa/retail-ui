import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mt-5 text-center">
      <h1 className="text-success">Payment Successful 🎉</h1>

      <p>Your order has been placed successfully.</p>

      {orderId && (
        <p className="mt-3">
          <strong>Order ID:</strong> {orderId}
        </p>
      )}

      <Link to="/" className="btn btn-primary mt-4">
        Continue Shopping
      </Link>
    </div>
  );
}
