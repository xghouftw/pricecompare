import React, { createContext, useState, useMemo } from 'react';

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter(item => item.id !== itemId));
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      const numericPrice = parseFloat(item.price);
      return acc + numericPrice;
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartContextProvider };