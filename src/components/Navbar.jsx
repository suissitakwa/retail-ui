import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Navbar() {
  const { totalItems: cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      {/* ── TOP BAR ─────────────────────────────────── */}
      <nav className="site-navbar sticky-top">
        <div className="topbar-inner">

          {/* Logo */}
          <Link to="/" className="brand-name">RetailShop</Link>

          {/* Search */}
          <form className="topbar-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for anything..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="topbar-search-btn" aria-label="Search">⌕</button>
          </form>

          {/* Actions */}
          <div className="topbar-actions">
            {user ? (
              <>
                <Link to="/profile" className="topbar-link">
                  <small>Hello, {user.firstname}</small>
                  Account
                </Link>
                <Link to="/orders" className="topbar-link">
                  <small>Returns &amp;</small>
                  Orders
                </Link>
                <Link to="/copilot" className="topbar-link">
                  <small>✨ AI</small>
                  Copilot
                </Link>
                <NotificationBell />
                <Link to="/cart" className="cart-btn">
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                  )}
                </Link>
                <button className="navbar-logout-btn btn btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/cart" className="cart-btn">
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                  )}
                </Link>
                <Link to="/login" className="cart-btn">Sign in</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── NAV STRIP ───────────────────────────────── */}
      <div className="nav-strip">
        <NavLink to="/" end className={({ isActive }) => `nav-strip-item${isActive ? " active" : ""}`}>🏠 Home</NavLink>
        <NavLink to="/shop" className={({ isActive }) => `nav-strip-item${isActive ? " active" : ""}`}>⚡ Today's Deals</NavLink>
        <NavLink to="/shop?cat=Electronics" className="nav-strip-item">📱 Electronics</NavLink>
        <NavLink to="/shop?cat=Fashion"     className="nav-strip-item">👗 Fashion</NavLink>
        <NavLink to="/shop?cat=Home"        className="nav-strip-item">🏡 Home &amp; Kitchen</NavLink>
        <NavLink to="/shop?cat=Beauty"      className="nav-strip-item">💄 Beauty</NavLink>
        <NavLink to="/shop?cat=Gaming"      className="nav-strip-item">🎮 Gaming</NavLink>
        <NavLink to="/shop?cat=Health"      className="nav-strip-item">🧘 Health</NavLink>
        {user?.role === "ROLE_ADMIN" && (
          <NavLink to="/admin" className={({ isActive }) => `nav-strip-item${isActive ? " active" : ""}`} style={{ color: "#f0a04b" }}>
            ⚙ Admin
          </NavLink>
        )}
      </div>
    </>
  );
}
