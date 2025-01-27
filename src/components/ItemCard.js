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
      <h4 style= {styles.title}>{product.description}</h4>
      <p style={styles.paragraph}>Brand: {product.brand}</p>
      <p style={styles.paragraph}>Store: {product.store}</p>
      <p style={styles.paragraph}>Price: ${product.price.toFixed(2)}</p>
      <div style= {styles.buttonContainer}>
        <button onClick={handleAddToCart} style = {styles.button}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
        >
          Add to Cart</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '3px solid #77d1ee',
    borderRadius: '4px',
    padding: '1rem',
    margin: '1rem',
    width: '225px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    maxWidth: '100%',
    height: 'auto'
  },
  paragraph: {
    margin: '3px'
  },
  buttonContainer: {
    marginTop: 'auto'
  },
  button: {
    marginTop: '12px',
    padding: '0.5rem 1rem',
    border: '3px solid #77d1ee',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    color: '#151da7',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold'
  },
  buttonHover: {
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: '1.2rem',
    margin: '0.5rem 0 0.2rem 0'
  },
};

export default ProductCard;