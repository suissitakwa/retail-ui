import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout action
    logout();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <BsNavbar bg="light" expand="lg" className="mb-4 shadow-sm sticky-top">
      <Container>
        {/* Use React Router Link component for the brand logo */}
        <BsNavbar.Brand as={Link} to="/">RetailUI</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">

          <Nav className="ms-auto d-flex align-items-center">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/shop">Shop</NavLink>

            {/* Cart Link with Badge */}
            <NavLink className="nav-link position-relative me-3" to="/cart">
              Cart
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="ms-1 position-absolute top-0 start-100 translate-middle"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
            </NavLink>

            {/* Conditional Navigation based on Auth State */}
            {user ? (
              <>
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
                <button
                  className="btn btn-sm btn-outline-secondary ms-3"
                  onClick={handleLogout}
                >
                  Logout ({user.name || user.email})
                </button>
              </>
            ) : (
              <NavLink className="btn btn-sm btn-primary text-white ms-3" to="/login">
                Login
              </NavLink>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}