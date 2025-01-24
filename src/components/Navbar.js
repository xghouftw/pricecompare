import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ padding: '1rem', background: '#fafafa' }}>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
            <li><Link to="/change-location">Change Location</Link></li>
            <li><Link to="/add-item">Add Item</Link></li>
            <li><Link to="/see-cart">See Cart</Link></li>
          </ul>
        </nav>
      );
}

export default Navbar;