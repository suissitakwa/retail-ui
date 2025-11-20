import React from "react";

export default function OrderDetailsDrawer({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Order #{order.id}</h3>
          <button className="drawer-close-btn" onClick={onClose}>✖</button>
        </div>

        <p className="drawer-date">
          Placed on: {new Date(order.createdDate).toLocaleString()}
        </p>

        <div className="drawer-section">
          <h4>Items</h4>
          {order.items.map((item) => (
            <div key={item.id} className="drawer-item">
              <img
                src="https://placehold.co/60x60"
                alt={item.productName}
                className="drawer-item-img"
              />
              <div>
                <p className="drawer-item-name">{item.productName}</p>
                <p className="drawer-item-qty">
                  {item.quantity} × ${item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-section">
          <h4>Order Summary</h4>
          <p><strong>Total Paid:</strong> ${order.totalAmount}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </div>

        <div className="drawer-footer">
          <button className="btn-primary w-full" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
