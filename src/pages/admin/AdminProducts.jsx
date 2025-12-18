import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  createProductAdmin,
  deleteProductAdmin
} from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: ""
  });

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProductAdmin({
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId)
      });
      setForm({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        imageUrl: ""
      });
      loadProducts();
    } catch (e) {
      setError("Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProductAdmin(id);
      loadProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">📦 Manage Products</h1>

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} className="bg-white p-4 border rounded mb-8">
        <h2 className="text-xl font-semibold mb-3">Add Product</h2>

        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          className="form-control mb-2"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Category ID"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        />

        <input
          className="form-control mb-3"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />

        <button className="btn btn-primary">Create Product</button>
      </form>

      {/* ERROR */}
      {error && <p className="text-danger">{error}</p>}

      {/* LIST */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="bg-white border rounded">
          {products.map(p => (
            <div
              key={p.id}
              className="d-flex justify-content-between align-items-center border-bottom p-3"
            >
              <div>
                <strong>{p.name}</strong>
                <div className="text-muted">${p.price}</div>
                <div className="text-muted">Category: {p.categoryId}</div>
              </div>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
