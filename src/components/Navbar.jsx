import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Badge } from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { totalItems: cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <BsNavbar expand="lg" className="site-navbar sticky-top">
      <Container>
        {/* BRAND */}
        <BsNavbar.Brand as={Link} to="/" className="navbar-brand-custom">
          <span className="brand-icon">🛍️</span>
          <span className="brand-name">RetailShop</span>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center gap-1">

            <NavLink
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link-active' : ''}`
              }
              to="/"
              end
            >
              Home
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link-active' : ''}`
              }
              to="/shop"
            >
              Shop
            </NavLink>

            {/* ADMIN */}
            {user?.role === "ROLE_ADMIN" && (
              <NavLink className="nav-link nav-link-admin" to="/admin">
                Admin Panel
              </NavLink>
            )}

            {/* CART */}
            <NavLink
              className={({ isActive }) =>
                `nav-link nav-link-cart${isActive ? ' nav-link-active' : ''}`
              }
              to="/cart"
            >
              <span className="cart-icon">🛒</span>
              <span>Cart</span>
              {cartCount > 0 && (
                <Badge bg="danger" pill className="cart-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
            </NavLink>

            {/* AUTH */}
            {user ? (
              <>
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' nav-link-active' : ''}`
                  }
                  to="/orders"
                >
                  My Orders
                </NavLink>

                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' nav-link-active' : ''}`
                  }
                  to="/profile"
                >
                  {user.firstname}
                </NavLink>

                <button
                  className="btn btn-sm btn-outline-primary ms-2 navbar-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="btn btn-sm btn-primary text-white ms-2 navbar-login-btn"
                to="/login"
              >
                Login
              </Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
