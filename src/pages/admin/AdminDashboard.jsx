import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminStats } from "../../api";

const NAV_CARDS = [
  { title: "Manage Products", desc: "Add, edit, or delete products.", path: "/admin/products", icon: "📦" },
  { title: "Manage Orders",   desc: "View and update order statuses.",  path: "/admin/orders",   icon: "🧾" },
  { title: "Manage Users",    desc: "View all customers and admins.",    path: "/admin/customers",icon: "👥" },
];

const STATUS_COLORS = {
  COMPLETED:  "#22c55e",
  PENDING:    "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED:    "#8b5cf6",
  DELIVERED:  "#06b6d4",
  CANCELLED:  "#ef4444",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetchAdminStats()
      .then(r => setStats(r.data))
      .catch(() => setError("Could not load stats."))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n) =>
    Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalOrders = stats?.totalOrders || 1;
  const statusEntries = stats
    ? Object.entries(stats.ordersByStatus).filter(([, v]) => v > 0)
    : [];

  return (
    <div className="container py-4">
      <h1 className="page-title mb-1">Admin Dashboard</h1>
      <p className="text-muted mb-4">Platform overview</p>

      {/* ── KPI cards ─────────────────────────────────────────── */}
      {loading ? (
        <p className="text-muted">Loading stats…</p>
      ) : error ? (
        <div className="alert alert-warning">{error}</div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <KpiCard label="Total Revenue"    value={`$${fmt(stats.totalRevenue)}`}    sub="all completed orders" color="#22c55e" />
            <KpiCard label="Revenue (30 days)" value={`$${fmt(stats.revenue30Days)}`}  sub="last 30 days"          color="#3b82f6" />
            <KpiCard label="Total Orders"     value={stats.totalOrders}               sub="all time"              color="#f59e0b" />
            <KpiCard label="Customers"        value={stats.totalCustomers}            sub="registered accounts"   color="#8b5cf6" />
          </div>

          {/* ── Orders by status ──────────────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card p-4 h-100">
                <h5 className="fw-semibold mb-3">Orders by Status</h5>
                {statusEntries.map(([status, count]) => (
                  <div key={status} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-medium">{status}</span>
                      <span className="small text-muted">{count}</span>
                    </div>
                    <div className="progress" style={{ height: 8, borderRadius: 4 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${Math.round((count / totalOrders) * 100)}%`,
                          backgroundColor: STATUS_COLORS[status] || "#6b7280",
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Top products ────────────────────────────────── */}
            <div className="col-md-6">
              <div className="card p-4 h-100">
                <h5 className="fw-semibold mb-3">Top Products (units sold)</h5>
                {stats.topProducts.length === 0 ? (
                  <p className="text-muted small">No completed orders yet.</p>
                ) : (
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th className="fw-medium text-muted small border-0">#</th>
                        <th className="fw-medium text-muted small border-0">Product</th>
                        <th className="fw-medium text-muted small border-0 text-end">Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topProducts.map((p, i) => (
                        <tr key={p.productName}>
                          <td className="text-muted small">{i + 1}</td>
                          <td className="small">{p.productName}</td>
                          <td className="small text-end fw-semibold">{p.unitsSold}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Navigation cards ──────────────────────────────────── */}
      <h5 className="fw-semibold mb-3">Quick Actions</h5>
      <div className="row g-4">
        {NAV_CARDS.map(({ title, desc, path, icon }) => (
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

function KpiCard({ label, value, sub, color }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="card p-4 h-100" style={{ borderTop: `3px solid ${color}` }}>
        <div className="fs-3 fw-bold" style={{ color }}>{value}</div>
        <div className="fw-semibold mt-1">{label}</div>
        <div className="text-muted small">{sub}</div>
      </div>
    </div>
  );
}
