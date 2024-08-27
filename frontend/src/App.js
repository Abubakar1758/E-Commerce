import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import CreateProductPage from './pages/CreateProduct';
import Navbar from './components/Navbar';
import ProductDetailPage from './pages/ProductDetail';
import YourProductPage from './pages/YourProduct';
import EditProductPage from './pages/EditProduct';
import CartPage from './pages/Cart';
import BrowseProductsPage from './pages/BrowseProducts';
import CheckoutPage from './pages/CheckOut';
import ConfirmationPage from './pages/Confirmation';
import MyOrdersPage from './pages/MyOrders';



function App() {

  return (
    <>
      <Router>

        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/browse-products" element={<BrowseProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product/edit/:id" element={<EditProductPage />} />
          <Route path="/your-products" element={<YourProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Routes>



      </Router>
    </>
  );
}

export default App;