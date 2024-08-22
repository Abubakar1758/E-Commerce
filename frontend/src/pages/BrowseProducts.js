import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductCard from '../components/ProductCard';

const BrowseProductsPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/product/get-all-products');
        const data = await response.json();

        if (response.ok) {
          setAllProducts(data);
        } else {
          console.error('Failed to fetch products:', data.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Calculate the products to display based on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 font-weight-bold">Browse All Products</h1>
        <p className="lead">Explore a wide range of products available in our store.</p>
      </div>

      <div className="mb-5">
        <div className="row">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product.id} className="col-md-3 mb-4">
                <ProductCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    images: product.images.length > 0 ? [`http://localhost:4000/${product.images[0].url}`] : ['/assets/default-product.png'],
                    price: product.price,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">No products available.</div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button 
          className="btn btn-primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          className="btn btn-primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrowseProductsPage;
