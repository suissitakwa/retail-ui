import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  { title: "Manage Products", desc: "Add, edit, or delete products.", path: "/admin/products", icon: "📦" },
  { title: "Manage Orders",   desc: "View and update order statuses.",  path: "/admin/orders",   icon: "🧾" },
  { title: "Manage Users",    desc: "View all customers and admins.",    path: "/admin/customers",icon: "👥" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="text-muted mb-4">Welcome, Admin! Choose an option below.</p>

      <div className="row g-4">
        {cards.map(({ title, desc, path, icon }) => (
          <div key={title} className="col-md-4">
            <div className="card p-4 h-100">
              <div className="mb-2" style={{ fontSize: "1.8rem" }}>{icon}</div>
              <h2 className="fw-semibold fs-5 mb-2">{title}</h2>
              <p className="text-muted mb-3">{desc}</p>
              <button className="btn btn-primary" onClick={() => navigate(path)}>
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
