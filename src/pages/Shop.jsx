import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NotificationBar = ({ message, type, onClose }) => {
  if (!message) return null;
  return (
    <div className={`notification-bar ${type}`}>
      <span>{message}</span>
      <button className="notification-close" onClick={onClose}>✕</button>
    </div>
  );
};

export default function Shop() {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState({});
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(res => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setNotification({ message: 'Could not load products.', type: 'error' });
      });
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user?.id) {
      setNotification({ message: 'Please log in to add items to your cart.', type: 'error' });
      return;
    }
    setAdding(prev => ({ ...prev, [productId]: true }));
    setNotification({ message: '', type: '' });
    try {
      await addToCart(productId, 1);
      setNotification({ message: 'Added to cart!', type: 'success' });
    } catch {
      setNotification({ message: 'Failed to add to cart.', type: 'error' });
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  const closeNotification = () => setNotification({ message: '', type: '' });

  const visibleProducts = activeCategory
    ? products.filter(p => p.categoryId === activeCategory || p.category?.id === activeCategory)
    : products;

  if (loading)
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span>Loading products…</span>
      </div>
    );

  return (
    <div className="container py-4">
      {/* PAGE HEADER */}
      <div className="shop-page-header mb-4">
        <h2 className="page-title mb-0">Shop</h2>
        <span className="product-count">{visibleProducts.length} products</span>
      </div>

      <NotificationBar
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {/* CATEGORY FILTER */}
      {categories.length > 0 && (
        <div className="category-filter">
          <button
            className={`category-btn${activeCategory === null ? ' active' : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCT GRID */}
      {visibleProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className="row g-4">
          {visibleProducts.map(p => (
            <div key={p.id} className="col-6 col-md-4 col-xl-3">
              <div className="product-card-amazon h-100 d-flex flex-column">
                <img
                  src={p.imageUrl || 'https://placehold.co/300x300'}
                  className="product-card-img"
                  alt={p.name}
                />
                <h5 className="product-card-title">{p.name}</h5>
                {p.category?.name && (
                  <span className="product-category-tag">{p.category.name}</span>
                )}
                <p className="product-card-price mt-auto">
                  ${Number(p.price).toFixed(2)}
                </p>
                <button
                  className="btn btn-primary w-100 mt-2"
                  onClick={() => handleAddToCart(p.id)}
                  disabled={adding[p.id] || !user}
                >
                  {adding[p.id] ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Adding…
                    </>
                  ) : !user ? 'Login to Add' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
