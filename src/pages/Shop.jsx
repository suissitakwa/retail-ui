import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NotificationBar = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`p-3 mb-4 rounded-md text-white ${
        type === 'error' ? 'bg-red-600' : 'bg-green-600'
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button className="font-bold ml-4" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default function Shop() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchProducts()
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setLoading(false);
        setNotification({ message: 'Could not load products.', type: 'error' });
      });
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user || !user.id) {
      setNotification({ message: 'Please log in to add items to your cart.', type: 'error' });
      return;
    }

    setAdding(prev => ({ ...prev, [productId]: true }));
    setNotification({ message: '', type: '' });

    try {
      await addToCart(productId, 1);
      setNotification({ message: 'Product added to cart!', type: 'success' });
    } catch (err) {
      console.error('Add to cart failed:', err);
      setNotification({ message: 'Failed to add to cart.', type: 'error' });
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  const closeNotification = () => setNotification({ message: '', type: '' });

  if (loading)
    return <div className="text-center my-5 p-5 text-xl font-medium">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">

      <h2 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-2">
        Shop
      </h2>

      <NotificationBar
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {/* -------------------------------
            PRODUCT GRID
      --------------------------------*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div className="product-card-amazon" key={p.id}>
            <img
              src={p.imageUrl || "https://placehold.co/300x300"}
              className="product-card-img"
              alt={p.name}
            />

            <h4 className="product-card-title">{p.name}</h4>

            <p className="product-card-price">${p.price.toFixed(2)}</p>

            <button
              className="btn-primary w-full mt-2"
              onClick={() => handleAddToCart(p.id)}
              disabled={adding[p.id] || !user}
            >
              {adding[p.id] ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
