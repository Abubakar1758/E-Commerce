import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleQuantityChange = (change) => {
    updateQuantity(item.product.id, item.quantity + change);
  };

  const truncateDescription = (description, length = 100) => {
    if (description.length <= length || showFullDescription) return description;
    return description.slice(0, length) + '...';
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      borderBottom: '1px solid #ddd',
      marginBottom: '15px',
    },
    image: {
      width: '100px',
      height: '100px',
      marginRight: '15px',
      borderRadius: '5px',
      objectFit: 'cover',
    },
    info: {
      flex: 1,
    },
    button: {
      margin: '0 5px',
    },
    quantity: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '10px',
    },
    price: {
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: '#007bff',
      marginTop: '10px',
      marginLeft: '20px',
      whiteSpace: 'nowrap',
    },
    description: {
      margin: '10px 0',
    },
    readMore: {
      color: '#007bff',
      cursor: 'pointer',
      marginLeft: '5px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={item.product.images?.[0]?.url ? `http://localhost:4000/${item.product.images[0].url}` : '/assets/default-product.png'}
          alt={item.product.name}
          style={styles.image}
        />
        <div style={styles.info}>
          <h5>{item.product.name}</h5>
          <p style={styles.description}>
            {truncateDescription(item.product.description)}
            {!showFullDescription && item.product.description.length > 100 && (
              <span
                style={styles.readMore}
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                Read more
              </span>
            )}
            {showFullDescription && (
              <span
                style={styles.readMore}
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                Show less
              </span>
            )}
          </p>
          <div style={styles.quantity}>
            <button
              style={styles.button}
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              style={styles.button}
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
            <button
              style={{ ...styles.button, backgroundColor: '#dc3545', color: '#fff' }}
              className="btn btn-sm"
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <span style={styles.price}>${(item.product.price * item.quantity).toFixed(2)}</span>
    </div>
  );
};

export default CartItem;
