import React, { useContext, useEffect } from 'react';
import { CartContext } from '../components/CartContext';

function SeeCart() {

  const {cart, addToCart, removeFromCart} = useContext(CartContext);

  useEffect(() => {
    addToCart({id: 1, name: 'apple', price: 1.99});
  }, []);

  useEffect(() => {
    console.log('cart has changed:', cart);
  }, [cart]);
  
  return (
    <div>
      <h2>See Cart</h2>
      <p>Here is your current shopping cart...</p>
    </div>
  );
}

export default SeeCart;
