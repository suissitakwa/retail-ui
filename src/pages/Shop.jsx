import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories, searchProducts } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const GRAD_COLORS = [
  'linear-gradient(135deg,#1a1a2e,#0f3460)',
  'linear-gradient(135deg,#0d2137,#1a4a6b)',
  'linear-gradient(135deg,#1e1a00,#3d3200)',
  'linear-gradient(135deg,#1a0a2e,#3d0f60)',
  'linear-gradient(135deg,#0a1a1a,#0f3d3d)',
  'linear-gradient(135deg,#1a0a0a,#3d1010)',
  'linear-gradient(135deg,#0a1a0a,#103d10)',
  'linear-gradient(135deg,#1a1a2e,#16213e)',
];
const EMOJIS = ['🎧','🚁','🪑','⌚','📷','🖥️','🎙️','💡','👗','💄','📱','🎮'];

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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get('q') || '';
  const catParam = searchParams.get('cat') || '';

  const [products,        setProducts]        = useState([]);
  const [categories,      setCategories]      = useState([]);
  const [activeCategory,  setActiveCategory]  = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [adding,          setAdding]          = useState({});
  const [notification,    setNotification]    = useState({ message: '', type: '' });

  useEffect(() => {
    fetchCategories().then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const req = qParam ? searchProducts(qParam) : fetchProducts();
    req
      .then(r => { setProducts(Array.isArray(r.data) ? r.data : []); setLoading(false); })
      .catch(() => { setLoading(false); setNotification({ message: 'Could not load products.', type: 'error' }); });
  }, [qParam]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.id);
    if (qParam) {
      setSearchParams({ q: qParam, cat: cat.name });
    } else {
      setSearchParams({ cat: cat.name });
    }
  };

  const handleShowAll = () => {
    setActiveCategory(null);
    navigate('/shop');
  };

  const handleClear = () => {
    setActiveCategory(null);
    navigate('/shop');
  };

  const isCatActive = (cat) =>
    activeCategory === cat.id ||
    (catParam && catParam.toLowerCase() === cat.name?.toLowerCase());

  const visible = (() => {
    if (catParam) {
      return products.filter(p => p.category?.name?.toLowerCase() === catParam.toLowerCase());
    }
    if (activeCategory) {
      return products.filter(p => p.categoryId === activeCategory || p.category?.id === activeCategory);
    }
    return products;
  })();

  const hasFilter = qParam || catParam;

  const handleAdd = async (productId) => {
    if (!user?.id) { setNotification({ message: 'Please log in to add items to your cart.', type: 'error' }); return; }
    setAdding(p => ({ ...p, [productId]: true }));
    setNotification({ message: '', type: '' });
    try {
      await addToCart(productId, 1);
      setNotification({ message: '✓ Added to cart!', type: 'success' });
    } catch {
      setNotification({ message: 'Failed to add to cart.', type: 'error' });
    } finally {
      setAdding(p => ({ ...p, [productId]: false }));
    }
  };

  if (loading) return (
    <div className="loading-center">
      <div className="spinner" />
      <span>Loading products…</span>
    </div>
  );

  return (
    <div className="site-main">

      {/* HEADER */}
      <div className="shop-page-header">
        <div>
          <h2 className="page-title">
            {qParam ? `Results for "${qParam}"` : 'Shop'}
          </h2>
          {hasFilter && (
            <button className="category-btn" style={{ marginTop: '6px' }} onClick={handleClear}>
              × Clear
            </button>
          )}
        </div>
        <span className="product-count">{visible.length} products</span>
      </div>

      <NotificationBar message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />

      {/* CATEGORY FILTER */}
      {categories.length > 0 && (
        <div className="category-filter">
          <button
            className={`category-btn${!activeCategory && !catParam ? ' active' : ''}`}
            onClick={handleShowAll}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn${isCatActive(cat) ? ' active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* PRODUCT GRID */}
      {visible.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</p>
          <p>No products found{qParam ? ` for "${qParam}"` : ' in this category'}.</p>
          <button className="category-btn active" style={{ marginTop: '12px' }} onClick={handleShowAll}>
            Browse all
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {visible.map((p, i) => (
            <div key={p.id} className="prod-card">
              <div className="prod-img" style={{ background: GRAD_COLORS[i % GRAD_COLORS.length] }}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} />
                  : EMOJIS[i % EMOJIS.length]
                }
              </div>
              <div className="prod-body">
                {p.category?.name && <div className="prod-brand">{p.category.name}</div>}
                <div className="prod-name">{p.name}</div>
              </div>
              <div className="prod-footer">
                <div>
                  <div className="prod-price">${Number(p.price).toFixed(2)}</div>
                </div>
                <button
                  className="add-btn"
                  onClick={() => handleAdd(p.id)}
                  disabled={adding[p.id] || !user}
                >
                  {adding[p.id] ? '…' : !user ? 'Sign in' : 'Add to cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
