import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container">
      <h2 className="mb-4">Shop</h2>
      <div className="row">
        {products.map(p => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100">
              <img
                src={p.imageUrl || 'https://via.placeholder.com/150'}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">${p.price.toFixed(2)}</p>
                <button className="btn btn-outline-primary mt-auto">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
