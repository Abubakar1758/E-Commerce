import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { CartContext } from '../contexts/CartContext';
import { ProductContext } from '../contexts/ProductContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import SearchResult from './SearchResult';

function Navbar() {
    const { user, logoutUser } = useContext(UserContext);
    const { cartItemCount } = useContext(CartContext);
    const { products } = useContext(ProductContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleLogout = () => {
        setDropdownOpen(false);
        logoutUser();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDropdownOpen(false);
        }
    };

    const profileImage = user?.displayPicture
        ? user.displayPicture
        : '/assets/default-avatar.png';

    const handleCartClick = () => {
        navigate('/cart');
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleProductClick = (productId) => {
        setSearchQuery('');
        setFilteredProducts([]);
        navigate(`/product/${productId}`);
    };

    return (
        <>
            <style>
                {`
                .navbar-nav .nav-link:hover, .navbar-nav .nav-link.active {
                    background-color: #0d6efd;
                    color: white !important;
                }
                .profile-dropdown .dropdown-toggle:hover {
                    background-color: transparent;
                    color: inherit;
                }
                .profile-dropdown .dropdown-menu {
                    right: 0;
                    min-width: 12rem;
                }
                .dropdown-toggle::after {
                    display: none;
                }
                .nav-link {
                    border: none;
                }
                @media (max-width: 768px) {
                    .navbar-nav {
                        margin-top: 1rem;
                    }
                }
                .cart-icon-container {
                    position: relative;
                    margin-left: 20px;
                    cursor: pointer;
                    padding: 5px;
                }
                .cart-icon-container .fa-shopping-cart {
                    color: #0d6efd;
                    font-size: 1.8rem;
                }
                .cart-icon-container .badge {
                    position: absolute;
                    top: -8px;
                    right: -12px;
                    background-color: red;
                    color: white;
                    border-radius: 50%;
                    padding: 5px 7px;
                    font-size: 0.75rem;
                }
                .search-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    display: block;
                    background-color: white;
                    border: 1px solid #ccc;
                    max-height: 200px;
                    overflow-y: auto;
                }
                .search-dropdown-item {
                    padding: 10px;
                    cursor: pointer;
                    background-color: white;
                }
                .search-dropdown-item:hover {
                    background-color: #f8f9fa;
                }
                `}
            </style>
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
                <a className="navbar-brand" href="#">E-Commerce</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item mx-2">
                            <button
                                className={`btn btn-link nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                onClick={() => navigate('/')}
                            >
                                Home
                            </button>
                        </li>
                        <li className="nav-item mx-2">
                            <button
                                className={`btn btn-link nav-link ${location.pathname === '/browse-products' ? 'active' : ''}`}
                                onClick={() => navigate('/browse-products')}
                            >
                                Browse Products
                            </button>
                        </li>
                        {user?.role === 'seller' && (
                            <>
                                <li className="nav-item mx-2">
                                    <button
                                        className={`btn btn-link nav-link ${location.pathname === '/your-products' ? 'active' : ''}`}
                                        onClick={() => navigate('/your-products')}
                                    >
                                        Your Products
                                    </button>
                                </li>
                                <li className="nav-item mx-2">
                                    <button
                                        className={`btn btn-link nav-link ${location.pathname === '/create-product' ? 'active' : ''}`}
                                        onClick={() => navigate('/create-product')}
                                    >
                                        Create Product
                                    </button>
                                </li>
                                <li className="nav-item mx-2">
                                    <button
                                        className={`btn btn-link nav-link ${location.pathname === '/orders' ? 'active' : ''}`}
                                        onClick={() => navigate('/orders')}
                                    >
                                        Orders
                                    </button>
                                </li>
                            </>
                        )}
                        {user?.role === 'buyer' && (
                            <>
                                <li className="nav-item mx-2">
                                    <button
                                        className={`btn btn-link nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`}
                                        onClick={() => navigate('/my-orders')}
                                    >
                                        My Orders
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center position-relative">
                        <form className="d-flex me-3 position-relative">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {filteredProducts.length > 0 && (
                                <SearchResult
                                    products={filteredProducts}
                                    onProductClick={handleProductClick}
                                />
                            )}
                        </form>
                        <div className="nav-item dropdown ms-3 profile-dropdown" onBlur={closeDropdown}>
                            <a
                                className="nav-link dropdown-toggle d-flex align-items-center"
                                href="#"
                                id="profileDropdown"
                                role="button"
                                onClick={toggleDropdown}
                                aria-expanded={dropdownOpen}
                                style={{ padding: 0 }}
                            >
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                            </a>
                            <ul
                                className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}
                                aria-labelledby="profileDropdown"
                            >
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="cart-icon-container" onClick={handleCartClick}>
                            <FontAwesomeIcon icon={faShoppingCart} />
                            {cartItemCount > 0 && (
                                <span className="badge">{cartItemCount}</span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
