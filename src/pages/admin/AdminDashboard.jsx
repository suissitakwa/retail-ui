import React from "react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Admin Dashboard
      </h1>

      <p className="text-gray-600 text-lg">
        Welcome, Admin! Choose an option from the side panel.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600 mb-3">
            Add, edit, or delete products.
          </p>
          <button className="btn-primary">Open</button>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Manage Orders</h2>
          <p className="text-gray-600 mb-3">
            View and update order statuses.
          </p>
          <button className="btn-primary">Open</button>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600 mb-3">
            View all customers and admins.
          </p>
          <button className="btn-primary">Open</button>
        </div>

      </div>
    </div>
  );
}
