import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <BsNavbar bg="light" expand="lg" className="mb-4 shadow-sm sticky-top">
      <Container>
        <BsNavbar.Brand as={Link} to="/">RetailUI</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/shop">Shop</NavLink>
            <NavLink className="nav-link position-relative" to="/cart">
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
            <NavLink className="nav-link" to="/profile">Profile</NavLink>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
