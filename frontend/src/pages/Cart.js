import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const CartPage = () => {
  const { cart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const navigate = useNavigate();

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

  const handleCheckout = () => {
    if (!user) {    
      navigate('/login');
    } else {
      localStorage.setItem('discountedTotal', getTotalPrice());
      navigate('/checkout');
    }
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow-sm">
      <h1 className="text-center mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center mt-5">
          <div className="display-1 text-muted mb-3">🛒</div>
          <p className="text-muted">Your cart is empty. Start shopping now!</p>
        </div>
      ) : (
        <>
          <div className="list-group">
            {cart.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-4">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="form-control d-inline w-auto mr-2"
            />
            <button onClick={applyCoupon} className="btn btn-primary">
              Apply Coupon
            </button>
            {couponError && <div className="text-danger mt-2">{couponError}</div>}
          </div>
          <div className="text-right mt-4">
            <h4>Total: ${getTotalPrice()}</h4>
          </div>
          <button onClick={handleCheckout} className="btn btn-success btn-block mt-4">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
