import React, { useEffect, useState } from "react";
import { fetchAllOrdersAdmin } from "../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllOrdersAdmin()
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load orders");
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">🧾 Manage Orders</h1>

      {error && <p className="text-danger">{error}</p>}

      {!orders.length ? (
        <p>No orders yet.</p>
      ) : (
        <div className="bg-white border rounded p-3">
          {orders.map((o) => (
            <div key={o.id} className="border-b py-2">
              <div className="fw-bold">Order #{o.id}</div>
              <div>Total: ${o.totalAmount}</div>
              <div>Payment: {o.paymentMethod}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
