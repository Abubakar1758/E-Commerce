import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchResult({ products, onProductClick }) {
    const navigate = useNavigate();

    const handleProductClick = (productId) => {
        onProductClick(productId);
        navigate(`/product/${productId}`);
    };

    return (
        <div className="search-dropdown">
            {products.length > 0 ? (
                products.map((product) => (
                    <div
                        key={product.id}
                        className="search-dropdown-item d-flex align-items-center"
                        onClick={() => handleProductClick(product.id)}
                    >
                        <img
                            src={product.images?.[0]?.url ? `http://localhost:4000/${product.images[0].url}` : '/assets/default-product.png'}
                            alt={product.name}
                            className="me-2"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <span>{product.name}</span>
                    </div>
                ))
            ) : (
                <div className="search-dropdown-item">No results found</div>
            )}
        </div>
    );
}

export default SearchResult;
