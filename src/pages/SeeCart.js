import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';

function SeeCart() {
  const { cart, removeFromCart, totalPrice} = useContext(CartContext);

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <ul style={styles.list}>
          {cart.map((item) => (
            <li key={item.id} style={styles.listItem}>
              <img 
                src={item.imageUrl} 
                alt={item.description} 
                style={{ width: '50px', marginRight: '0.5rem' }}
              />
              <div>
                <strong>{item.description}</strong> — {item.brand} — {item.price} at {item.store}
              </div>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${totalPrice.toFixed(2)}</h3>

    </div>
  );
}

const styles = {
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  }
};

export default SeeCart;
