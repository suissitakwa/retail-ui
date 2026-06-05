import React, { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import { useAuth } from "../context/AuthContext";

const STATUS_CLASS = {
  COMPLETED: "status-completed",
  PENDING:   "status-pending",
  CANCELLED: "status-cancelled",
};

export default function Orders() {
  const { token } = useAuth();
  const [orders,   setOrders]   = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0 });
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMyOrders(pageInfo.page, pageInfo.size)
      .then(res => {
        setOrders(res.data.content);
        setPageInfo(p => ({ ...p, totalPages: res.data.totalPages }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageInfo.page, pageInfo.size, token]);

  if (loading)
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading your orders…</span>
      </div>
    );

  if (!orders.length)
    return (
      <div className="site-main">
        <h2 className="page-title">My Orders</h2>
        <div className="empty-state">
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📦</p>
          <p style={{ fontWeight: 600, marginBottom: '6px' }}>No orders yet</p>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Your orders will appear here once you make a purchase.</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="site-main">
        <h2 className="page-title">My Orders</h2>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                    Order #{order.id} · <span style={{ fontFamily: 'monospace', color: 'var(--muted)', fontSize: '12px' }}>{order.reference}</span>
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                    {new Date(order.createdDate).toLocaleString()}
                  </p>
                </div>
                <span className={`order-status-tag ${STATUS_CLASS[order.status] || 'status-pending'}`}>
                  {order.status}
                </span>
              </div>

              {/* Item preview */}
              {order.items?.slice(0, 2).map(item => (
                <div key={item.id} className="drawer-item" style={{ padding: '10px 0' }}>
                  <img
                    src="https://placehold.co/60x60/18181f/8884a0?text=📦"
                    alt={item.productName}
                    className="drawer-item-img"
                    style={{ width: 52, height: 52 }}
                  />
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 500 }}>{item.productName}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {order.items?.length > 2 && (
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
                  +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '16px' }}>
                  ${Number(order.totalAmount).toFixed(2)}
                </span>
                <button className="view-details-btn" onClick={() => setSelected(order)}>
                  View details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pageInfo.totalPages > 1 && (
          <div className="pagination-controls">
            <button
              disabled={pageInfo.page === 0}
              onClick={() => setPageInfo(p => ({ ...p, page: p.page - 1 }))}
            >← Previous</button>
            <span>Page {pageInfo.page + 1} of {pageInfo.totalPages}</span>
            <button
              disabled={pageInfo.page + 1 >= pageInfo.totalPages}
              onClick={() => setPageInfo(p => ({ ...p, page: p.page + 1 }))}
            >Next →</button>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selected && (
        <div className="drawer-overlay" onClick={() => setSelected(null)}>
          <div className="drawer-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order #{selected.id}</h3>
              <button className="drawer-close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="drawer-section">
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Reference</span>
                <p style={{ fontFamily: 'monospace', margin: '2px 0 0', fontSize: '13px' }}>{selected.reference}</p>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Placed</span>
                <p style={{ margin: '2px 0 0', fontSize: '13px' }}>{new Date(selected.createdDate).toLocaleString()}</p>
              </div>

              <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</p>
              {selected.items?.map(item => (
                <div key={item.id} className="drawer-item">
                  <img
                    src="https://placehold.co/60x60/18181f/8884a0?text=📦"
                    alt={item.productName}
                    className="drawer-item-img"
                  />
                  <div>
                    <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 500 }}>{item.productName}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--accent)' }}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="drawer-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--accent)' }}>
                ${Number(selected.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
