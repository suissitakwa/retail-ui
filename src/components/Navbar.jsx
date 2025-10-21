import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';

export default function Navbar() {
  return (
    <BsNavbar bg="light" expand="lg">
      <Container>
        <BsNavbar.Brand href="/">RetailUI</BsNavbar.Brand>
        <BsNavbar.Toggle />
        <BsNavbar.Collapse>
          <Nav className="ms-auto">
            <NavLink className="nav-link" to="/">Home</NavLink>
            <NavLink className="nav-link" to="/shop">Shop</NavLink>
            <NavLink className="nav-link" to="/cart">Cart</NavLink>
            <NavLink className="nav-link" to="/profile">Profile</NavLink>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
