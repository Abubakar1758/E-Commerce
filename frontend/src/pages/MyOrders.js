import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const MyOrdersPage = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await fetch(`http://localhost:4000/orders/user/${user.id}`);
          const data = await response.json();

          if (Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-muted">You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span><strong>Order #{order.id}</strong></span>
              <span>Total: <strong>${order.totalAmount.toFixed(2)}</strong></span>
            </div>
            <div className="card-body">
              <h5 className="card-title">Order Items</h5>
              <ul className="list-group">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.itemName}</strong>
                      <div className="text-muted">Quantity: {item.quantity}</div>
                    </div>
                    <div>
                      <span className="badge bg-success p-2">${item.price.toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer text-muted">
              <strong>Coupon Applied:</strong> {order.coupon || 'None'}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;
