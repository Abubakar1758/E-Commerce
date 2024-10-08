import React, { useState, useContext } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
const stripePromise = loadStripe('pk_test_51Pqx2N05ECef6IIAtDWJ2fHFQoUHgaQU66spXlTp03jWNbzKmhaMVcx3WpJKfdO1s30wVrzephEZf0EGBMzn8jy900HYBnDDPJ');

const CheckoutForm = () => {
  const { cart, clearCart } = useContext(CartContext); 
  const { user } = useContext(UserContext);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getDiscountedAmount = () => {
    const discountedTotal = localStorage.getItem('discountedTotal');
    return discountedTotal ? parseFloat(discountedTotal) * 100 : 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create Payment Intent
      const { clientSecret } = await fetch('http://localhost:4000/payment/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: getDiscountedAmount() }),
      }).then(res => res.json());

      // Confirm Card Payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
       
        const userId = user.id; 
        const coupon = localStorage.getItem('coupon') || null;
        const totalAmount = getDiscountedAmount() / 100; // Convert back to dollars

        const orderResponse = await fetch('http://localhost:4000/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            totalAmount,
            coupon,
            items: cart.map(item => ({
              productId: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            })),
          }),
        });

        if (orderResponse.ok) {
          alert('Payment successful and order placed!');
          clearCart(); 
          localStorage.removeItem('discountedTotal'); 
          localStorage.removeItem('coupon');
          navigate('/confirmation');
        } else {
          setError('Failed to save order.');
        }
      }
    } catch (err) {
      setError('Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    const discountedTotal = localStorage.getItem('discountedTotal');
    return discountedTotal ? `$${parseFloat(discountedTotal).toFixed(2)}` : '$0.00';
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white rounded shadow-sm" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">Checkout</h2>
      <div className="mb-4">
        <h3 className="mb-3">Cart Summary</h3>
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li key={item.product.id} className="list-group-item d-flex justify-content-between align-items-center">
              {item.product.name} x {item.quantity} 
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-end">
          <strong>Total: {getTotalAmount()}</strong>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="card-element" className="form-label">Card details</label>
        <CardElement id="card-element" className="form-control" options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#333',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
      <button type="submit" disabled={!stripe || loading} className="btn btn-success w-100">
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const CheckoutPage = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default CheckoutPage;
