import React, { useContext } from 'react';
import { CartContext } from './CartContext'; // Adjust path accordingly

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div style={styles.card}>
      <img src={product.imageUrl} alt={product.description} style={styles.image} />
      <h4>{product.description}</h4>
      <p>Brand: {product.brand}</p>
      <p>Store: {product.store}</p>
      <p>Price: {product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '1rem',
    margin: '1rem',
    width: '200px',
    textAlign: 'center'
  },
  image: {
    maxWidth: '100%',
    height: 'auto'
  }
};

export default ProductCard;
