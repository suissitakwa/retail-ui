import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORY_ICONS = {
  Electronics: '📱', Fashion: '👗', 'Home & Kitchen': '🏡', Home: '🏡',
  Beauty: '💄', Gaming: '🎮', Health: '🧘', Books: '📚', Sports: '⚽',
  Toys: '🧸', Food: '🍎', default: '🛍️',
};

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

const EMOJIS = ['🎧', '🚁', '🪑', '⌚', '📷', '🖥️', '🎙️', '💡'];

export default function Home() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [heroProduct, setHeroProduct] = useState(null);
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [adding,      setAdding]      = useState({});

  useEffect(() => {
    fetchProducts()
      .then(r => {
        const all = r.data || [];
        setHeroProduct(all[0] || null);        // first product → hero card
        setProducts(all.slice(1, 9));           // next 8 → deals grid
      })
      .catch(() => {});

    fetchCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  const handleAdd = async (productId) => {
    if (!user?.id) { navigate('/login'); return; }
    setAdding(p => ({ ...p, [productId]: true }));
    try { await addToCart(productId, 1); } catch {}
    finally { setAdding(p => ({ ...p, [productId]: false })); }
  };

  return (
    <>
      {/* ─── HERO ───────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">✦ SUMMER SALE — UP TO 60% OFF</div>
            <h1 className="hero-title">
              Everything you<br />want, <em>delivered</em><br />tomorrow.
            </h1>
            <p className="hero-subtitle">
              Next-day delivery, free over $35. Prices that actually make sense.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn hero-btn-primary">Shop Today's Deals →</Link>
              <Link to="/shop" className="btn hero-btn-ghost">Browse All Categories</Link>
            </div>
          </div>

          {/* Hero card — real product from API */}
          <div className="hero-visual">
            <div className="hero-float f1">⚡ Next-Day Delivery</div>
            <div className="hero-card">
              <div className="hero-img-wrap">
                {heroProduct?.imageUrl
                  ? <img src={heroProduct.imageUrl} alt={heroProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '🎧'
                }
              </div>
              <div className="hero-card-body">
                <div className="hero-card-tag">✦ Featured Deal</div>
                <div className="hero-card-title">
                  {heroProduct ? heroProduct.name : 'Top pick of the day'}
                </div>
                <div className="hero-card-price">
                  <span className="price-now">
                    {heroProduct ? `$${Number(heroProduct.price).toFixed(2)}` : '—'}
                  </span>
                </div>
              </div>
            </div>
            <div className="hero-float f2">⭐ 4.9 <span className="val">Top rated</span></div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────── */}
      <div className="stats-bar">
        <div className="stat-item"><div className="stat-num">{products.length > 0 ? `${products.length + 1}+` : '—'}</div><div className="stat-label">Products Available</div></div>
        <div className="stat-item"><div className="stat-num">{categories.length > 0 ? categories.length : '—'}</div><div className="stat-label">Categories</div></div>
        <div className="stat-item"><div className="stat-num">98.7%</div><div className="stat-label">On-Time Delivery</div></div>
        <div className="stat-item"><div className="stat-num">Free</div><div className="stat-label">Returns · 30 Days</div></div>
      </div>

      <main className="site-main">

        {/* ─── SHOP BY CATEGORY ───────────────────── */}
        {categories.length > 0 && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Shop by Category</h2>
              <Link to="/shop" className="see-all-link">All categories →</Link>
            </div>
            <div className="cat-grid">
              {categories.slice(0, 6).map(cat => (
                <div key={cat.id} className="cat-card" onClick={() => navigate('/shop')}>
                  <div className="cat-icon">{CATEGORY_ICONS[cat.name] || CATEGORY_ICONS.default}</div>
                  <div className="cat-name">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TODAY'S TOP DEALS ──────────────────── */}
        {products.length > 0 && (
          <div>
            <div className="section-header">
              <h2 className="section-title">Today's Top Deals</h2>
              <Link to="/shop" className="see-all-link">See all deals →</Link>
            </div>
            <div className="product-grid">
              {products.map((p, i) => (
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
                    <div className="prod-stars">★★★★★ <span>(1.2K)</span></div>
                  </div>
                  <div className="prod-footer">
                    <div className="prod-price">${Number(p.price).toFixed(2)}</div>
                    <button
                      className="add-btn"
                      onClick={() => handleAdd(p.id)}
                      disabled={adding[p.id]}
                    >
                      {adding[p.id] ? '…' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PROMO BANNERS ──────────────────────── */}
        <div className="banner-grid">
          <div className="promo-banner b1">
            <div className="banner-emoji">💻</div>
            <div>
              <div className="banner-label">✦ Limited Time</div>
              <div className="banner-title">Tech Mega Sale<br />Up to 60% Off</div>
              <Link to="/shop" className="banner-cta-btn">Shop the Sale →</Link>
            </div>
          </div>
          <div className="promo-banner b2">
            <div className="banner-emoji">👗</div>
            <div>
              <div className="banner-label">🌿 New Collection</div>
              <div className="banner-title">Summer Fashion<br />Fresh Arrivals</div>
              <Link to="/shop" className="banner-cta-btn">Shop the Collection →</Link>
            </div>
          </div>
        </div>

      </main>

      {/* ─── FOOTER ─────────────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="brand-name" style={{ display: 'inline-block', marginBottom: '12px' }}>RetailShop</div>
            <p className="footer-desc">
              Fast delivery. Real prices. Everything from headphones to home goods — shipped to your door.
            </p>
          </div>
          <div className="footer-col">
            <h4>About Us</h4>
            <a href="#/">About RetailShop</a>
            <a href="#/">Careers</a>
            <a href="#/">Sustainability</a>
          </div>
          <div className="footer-col">
            <h4>Customer Service</h4>
            <a href="#/">Help Center</a>
            <Link to="/orders">Track Your Order</Link>
            <a href="#/">Returns</a>
          </div>
          <div className="footer-col">
            <h4>Sell with Us</h4>
            <a href="#/">Become a Seller</a>
            <a href="#/">Affiliate Program</a>
            <a href="#/">Partner Network</a>
          </div>
        </div>
        <div className="footer-bottom">© 2026 RetailShop Inc. · All rights reserved. · Privacy Policy · Terms of Service</div>
      </footer>
    </>
  );
}
