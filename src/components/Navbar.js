import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
      <nav className = "nav">
          <div className="left">
              <img src="/supermonkey.webp" alt="Logo" className="logo" />
              <h1 className="title">Supermonkey's Supermarket Comparison</h1>
          </div>
          <ul className="right">
              <li><Link to="/change-location">Change Location</Link></li>
              <li><Link to="/add-item">Add Item</Link></li>
              <li><Link to="/see-cart">See Cart</Link></li>
          </ul>
      </nav>
  );
}

export default Navbar;