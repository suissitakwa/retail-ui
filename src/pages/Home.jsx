import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="mb-4">Welcome to RetailUI</h1>
      <p>Shop the latest fashion products online.</p>
      <Link to="/shop" className="btn btn-primary mt-3">Start Shopping here</Link>
    </div>
  );
}
