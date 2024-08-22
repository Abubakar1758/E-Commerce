import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUp';
import LoginPage from './pages/LogIn';
import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import CreateProductPage from './pages/CreateProduct';
import Navbar from './components/Navbar';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';
import ProductDetailPage from './pages/ProductDetail';
import YourProductPage from './pages/YourProduct';
import EditProductPage from './pages/EditProduct';
import CartPage from './pages/Cart';
import BrowseProductsPage from './pages/BrowseProducts';


function App() {
  const { user } = useContext(UserContext);
  return (
    <>
      <Router>
        {user &&
          <Navbar />
        }
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/browse-products" element={<BrowseProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/product/edit/:id" element={<EditProductPage />} />
          <Route path="/your-products" element={<YourProductPage/>} />
          <Route path="/cart" element={<CartPage/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;