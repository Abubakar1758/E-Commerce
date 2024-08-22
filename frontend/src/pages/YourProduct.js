import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../contexts/UserContext';
import ProductCard from '../components/ProductCard';

const YourProductPage = () => {
    const { user } = useContext(UserContext); 
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchUserProducts = async () => {
            if (!user) return;

            try {
                const response = await fetch(`http://localhost:4000/product/user/${user.id}`);
                const data = await response.json();
                if (response.ok) {
                    setProducts(data);
                } else {
                    console.error('Failed to fetch products:', data.message);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchUserProducts();
    }, [user]);

    if (!user) {
        return <div>Please log in to view your products.</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Your Products</h1>
            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="col-md-3 mb-4">
                            <ProductCard
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    description: product.description,
                                    images: product.images.map(img => `http://localhost:4000/${img.url}`),
                                    price: product.price,
                                }}
                                canEdit={true}
                                
                            />
                        </div>
                    ))
                ) : (
                    <div>No products found.</div>
                )}
            </div>
        </div>
    );
};

export default YourProductPage;
