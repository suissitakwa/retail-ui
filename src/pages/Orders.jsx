import React, { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import { useAuth } from "../context/AuthContext";

const statusMap = {
  COMPLETED: "status-completed",
  PENDING:   "status-pending",
  CANCELLED: "status-cancelled",
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders]     = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0 });
  const [loading, setLoading]   = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMyOrders(pageInfo.page, pageInfo.size)
      .then((res) => {
        setOrders(res.data.content);
        setPageInfo((prev) => ({ ...prev, totalPages: res.data.totalPages }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
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
      <div className="text-center p-4 text-muted">
        You have no orders yet.
      </div>
    );

  return (
    <>
      <div className="container py-4">
        <h2 className="page-title">My Orders</h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* HEADER */}
              <div className="order-header">
                <div>
                  <h3 className="mb-1">Order #{order.id}</h3>
                  <p className="text-muted mb-0">
                    Placed on {new Date(order.createdDate).toLocaleString()}
                  </p>
                </div>
                <span className={`order-status-tag ${statusMap[order.paymentMethod]}`}>
                  {order.paymentMethod}
                </span>
              </div>

              {/* ITEM PREVIEW */}
              <div className="row g-3 mt-2">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="col-md-6">
                    <div className="drawer-item">
                      <img
                        src="https://placehold.co/80x80"
                        alt={item.productName}
                        className="drawer-item-img"
                      />
                      <div>
                        <p className="fw-medium mb-1">{item.productName}</p>
                        <p className="text-muted mb-0">
                          {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="fw-bold fs-6 mb-0">Total: ${order.totalAmount}</p>
                <button
                  className="view-details-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="pagination-controls">
          <button
            disabled={pageInfo.page === 0}
            onClick={() => setPageInfo((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </button>
          <span>Page {pageInfo.page + 1} / {pageInfo.totalPages}</span>
          <button
            disabled={pageInfo.page + 1 >= pageInfo.totalPages}
            onClick={() => setPageInfo((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>

      {/* ORDER DETAILS DRAWER */}
      {selectedOrder && (
        <div className="drawer-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button className="drawer-close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>

            <div className="drawer-section">
              <h4 className="mb-3 fw-semibold">Order Items</h4>
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="drawer-item">
                  <img
                    src="https://placehold.co/80x80"
                    alt={item.productName}
                    className="drawer-item-img"
                  />
                  <div>
                    <p className="mb-1">{item.productName}</p>
                    <p className="text-muted mb-0">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <p className="fw-bold fs-5 mb-0">
                Total: ${selectedOrder.totalAmount}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
