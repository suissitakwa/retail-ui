import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProducts()
      .then(res => setFeatured((res.data || []).slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">New Season 2025</span>
          <h1 className="hero-title">
            Shop Smart.<br />Live Better.
          </h1>
          <p className="hero-subtitle">
            Discover the latest trends in fashion, electronics, and lifestyle —
            all delivered to your door.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-light btn-lg hero-btn-primary">
              Shop Now
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg">
              Join Free
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPS ──────────────────────────────────── */}
      <section className="container my-5">
        <div className="row g-4 text-center">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $50' },
            { icon: '🔒', title: 'Secure Payment', desc: 'Stripe-powered checkout' },
            { icon: '↩️', title: 'Easy Returns',  desc: '30-day return policy' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">{icon}</div>
                <h5 className="feature-title">{title}</h5>
                <p className="feature-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ────────────────────────────── */}
      {featured.length > 0 && (
        <section className="container mb-5">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/shop" className="see-all-link">See all →</Link>
          </div>
          <div className="row g-3">
            {featured.map(p => (
              <div key={p.id} className="col-6 col-md-4 col-lg-2">
                <div className="product-card-amazon product-card-home">
                  <img
                    src={p.imageUrl || 'https://placehold.co/200x200'}
                    className="product-card-img"
                    alt={p.name}
                  />
                  <h6 className="product-card-title">{p.name}</h6>
                  <p className="product-card-price">${Number(p.price).toFixed(2)}</p>
                  <Link to="/shop" className="btn btn-sm btn-primary w-100 mt-1">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── BANNER CTA ───────────────────────────────────── */}
      <section className="banner-cta mb-5">
        <div className="container text-center">
          <h3 className="banner-title">Ready to find something you love?</h3>
          <p className="banner-subtitle">Thousands of products waiting for you.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            Browse the Shop
          </Link>
        </div>
      </section>
    </>
  );
}
