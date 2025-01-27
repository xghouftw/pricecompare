import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import '../App.css';
import './SeeCart.css'; 

function SeeCart() {
  const { cart, removeFromCart, clearCart, totalPrice} = useContext(CartContext);

  return (
    <div className = "page-container">
      <h1>Your Cart</h1>
      <div className="cart-header">
        <button className="clear-button" onClick={clearCart}>
          <strong>Clear All</strong>
        </button>
      </div>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li className="cart-item" key={item.id}>
              <div className="item-left">
                <img 
                  className="item-image"
                  src={item.imageUrl}
                  alt={item.description}
                />
                <div className="item-info">
                  <strong>{item.description}</strong>
                  {item.brand}
                </div>
              </div>
              <div className="item-right">
                <div>
                  ${item.price.toFixed(2)} at {item.store} (x{item.quantity})
                </div>
                <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                  Remove One
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>

    </div>
  );
}

export default SeeCart;