import React, { useEffect, useState } from "react";
import { fetchAllCustomersAdmin } from "../../api";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllCustomersAdmin()
      .then((res) => setCustomers(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load customers");
      });
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">👥 Manage Customers</h1>

      {error && <p className="text-danger">{error}</p>}

      {!customers.length ? (
        <p>No customers found.</p>
      ) : (
        <div className="bg-white border rounded p-3">
          {customers.map((c) => (
            <div key={c.id} className="border-b py-2">
              <div className="fw-bold">{c.firstname} {c.lastname}</div>
              <div>{c.email}</div>
              <div className="text-muted">{c.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
