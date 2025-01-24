import React from 'react';

function ItemCard({ item, onAddToCart }) {
  const { id, name, imageurl, link, price, store, upc } = item;

  return (
    <div style={styles.card}>
      <img src={image} alt={name} style={styles.image} />
      <h4>{name}</h4>
      <p>Store: {store}</p>
      <p>Price: ${price}</p>
      <a href={link} target="_blank" rel="noreferrer">
        View on {store}
      </a>
      <button onClick={() => onAddToCart(item)}>
        Add to Cart
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    margin: '10px',
    padding: '10px',
    width: '200px',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
};

export default ItemCard;
