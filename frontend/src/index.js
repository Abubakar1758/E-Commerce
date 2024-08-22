import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <UserProvider>
      <CartProvider>
<ProductProvider>
          <App />
          </ProductProvider>
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
