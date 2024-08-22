import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/CartItem';

const CartPage = () => {
  const { cart } = useContext(CartContext);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const getTotalPrice = () => {
    const total = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const discountedTotal = total - total * discount;
    return discountedTotal.toFixed(2);
  };

  const applyCoupon = async () => {
    setCouponError('');
    try {
      const response = await fetch(`http://localhost:4000/coupons/validate?code=${coupon}`);
      if (!response.ok) {
        throw new Error('Invalid coupon code');
      }
      const data = await response.json();
      setDiscount(data.discountPercentage);
    } catch (error) {
      setCouponError(error.message);
      setDiscount(0);
    }
  };

  const styles = {
    container: {
      marginTop: '50px',
      padding: '20px',
      maxWidth: '800px',
      margin: '50px auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    header: {
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '2rem',
      color: '#333',
    },
    emptyMessage: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#888',
      marginTop: '50px',
    },
    emptyIcon: {
      fontSize: '50px',
      color: '#ddd',
      marginBottom: '20px',
    },
    couponContainer: {
      marginTop: '20px',
      textAlign: 'center',
    },
    input: {
      padding: '10px',
      fontSize: '1rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      marginRight: '10px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
    error: {
      color: 'red',
      marginTop: '10px',
    },
    total: {
      textAlign: 'right',
      fontWeight: 'bold',
      marginTop: '20px',
      fontSize: '1.5rem',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Your Cart</h1>
      {cart.length === 0 ? (
        <div style={styles.emptyMessage}>
          <div style={styles.emptyIcon}>🛒</div>
          <p>Your cart is empty. Start shopping now!</p>
        </div>
      ) : (
        <>
          <div className="list-group">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <div style={styles.couponContainer}>
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              style={styles.input}
            />
            <button onClick={applyCoupon} style={styles.button}>
              Apply Coupon
            </button>
            {couponError && <div style={styles.error}>{couponError}</div>}
          </div>
          <div style={styles.total}>
            <h4>Total: ${getTotalPrice()}</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
