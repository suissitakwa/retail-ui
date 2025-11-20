import React, { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import { useAuth } from "../context/AuthContext";

const statusMap = {
  COMPLETED: "status-completed",
  PENDING: "status-pending",
  CANCELLED: "status-cancelled",
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchMyOrders(pageInfo.page, pageInfo.size)
      .then((res) => {
        setOrders(res.data.content);
        setPageInfo((prev) => ({
          ...prev,
          totalPages: res.data.totalPages,
        }));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      });
  }, [pageInfo.page, token]);

  if (loading)
    return <div className="text-center text-xl p-6">Loading your orders...</div>;

  if (!orders.length)
    return <div className="text-center p-6 text-gray-600">You have no orders yet.</div>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="page-title">My Orders</h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* HEADER */}
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="text-muted">
                    Placed on {new Date(order.createdDate).toLocaleString()}
                  </p>
                </div>

                <span className={`order-status-tag ${statusMap[order.paymentMethod]}`}>
                  {order.paymentMethod}
                </span>
              </div>

              {/* ITEM PREVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="drawer-item">
                    <img
                      src="https://placehold.co/80x80"
                      alt={item.productName}
                      className="drawer-item-img"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-muted">
                        {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-bold">Total: ${order.totalAmount}</p>

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

          <span>
            Page {pageInfo.page + 1} / {pageInfo.totalPages}
          </span>

          <button
            disabled={pageInfo.page + 1 >= pageInfo.totalPages}
            onClick={() => setPageInfo((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>

      {/* ===================================================
          ORDER DETAILS DRAWER
      =================================================== */}
      {selectedOrder && (
        <div className="drawer-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button className="drawer-close-btn" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>

            <div className="drawer-section">
              <h4 className="mb-2 font-semibold">Order Items</h4>

              {selectedOrder.items.map((item) => (
                <div key={item.id} className="drawer-item">
                  <img
                    src="https://placehold.co/80x80"
                    alt={item.productName}
                    className="drawer-item-img"
                  />
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-muted">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <p className="font-bold text-xl">
                Total: ${selectedOrder.totalAmount}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
