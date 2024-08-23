import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/product/latest?limit=4');
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          console.error('Failed to fetch recent products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 font-weight-bold">Welcome to Our Store</h1>
        <p className="lead">Discover a range of amazing products tailored just for you.</p>
      </div>

      <div className="mb-5">
        <h2 className="font-weight-bold mb-4">Recent Products</h2>
        <div className="row">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    images: product.images.map(img => img.url),
                    price: product.price,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-12">No recent products available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
