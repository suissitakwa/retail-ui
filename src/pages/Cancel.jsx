import React from "react";
import { Link } from "react-router-dom";

export default function Cancel() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="text-danger">Payment Canceled ❌</h1>
      <p>Your payment was not completed.</p>

      <Link to="/cart" className="btn btn-warning mt-4">
        Back to Cart
      </Link>
    </div>
  );
}
