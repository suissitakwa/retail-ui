import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  createProductAdmin,
  deleteProductAdmin,
  fetchCategories,
  updateInventoryQty
} from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    quantity: 50,
  });

  const load = async () => {
    try {
      const [pRes, cRes] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch (e) {
      setError("Failed to load products/categories");
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const created = await createProductAdmin({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl
      });

      // after create, set inventory qty (or do it in backend create)
      await updateInventoryQty(created.data.id, Number(form.quantity));

      setForm({ name:"", description:"", price:"", categoryId:"", imageUrl:"", quantity:50 });
      await load();
    } catch (e) {
      setError("Failed to create product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProductAdmin(id);
      await load();
    } catch {
      setError("Failed to delete product");
    }
  };

  const handleQtyChange = async (productId, quantity) => {
    try {
      await updateInventoryQty(productId, Number(quantity));
      await load();
    } catch {
      setError("Failed to update inventory");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">📦 Manage Products</h1>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleCreate} className="bg-white p-4 border rounded mb-8">
        <h2 className="text-xl font-semibold mb-3">Add Product</h2>

        <input className="form-control mb-2" placeholder="Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})} required />

        <input className="form-control mb-2" placeholder="Description"
          value={form.description}
          onChange={(e)=>setForm({...form,description:e.target.value})} required />

        <input className="form-control mb-2" type="number" placeholder="Price"
          value={form.price}
          onChange={(e)=>setForm({...form,price:e.target.value})} required />

        {/* ✅ category dropdown */}
        <select
          className="form-control mb-2"
          value={form.categoryId}
          onChange={(e)=>setForm({...form,categoryId:e.target.value})}
          required
        >
          <option value="">Select category</option>
          {categories.map((c)=>(
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* ✅ inventory qty */}
        <input
          className="form-control mb-2"
          type="number"
          min="0"
          placeholder="Initial Stock Quantity"
          value={form.quantity}
          onChange={(e)=>setForm({...form,quantity:e.target.value})}
        />

        <input className="form-control mb-3" placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e)=>setForm({...form,imageUrl:e.target.value})} />

        <button className="btn btn-primary">Create Product</button>
      </form>

      <div className="bg-white border rounded">
        {products.map((p) => (
          <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom p-3">
            <div>
              <strong>{p.name}</strong>
              <div className="text-muted">${p.price}</div>
              <div className="text-muted">Category: {p.categoryId}</div>

              {/* ✅ inline inventory editor */}
              <div className="mt-2 d-flex align-items-center gap-2">
                <small className="text-muted">Stock:</small>
                <input
                  style={{ width: 120 }}
                  className="form-control form-control-sm"
                  type="number"
                  min="0"
                  defaultValue={p.quantity ?? 0}
                  onBlur={(e) => handleQtyChange(p.id, e.target.value)}
                />
                <small className="text-muted">(change then click outside)</small>
              </div>
            </div>

            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
