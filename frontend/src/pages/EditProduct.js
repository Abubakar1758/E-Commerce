import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';

function EditProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchProducts } = useContext(ProductContext);
    
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        images: []
    });

    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details on component mount
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:4000/product/${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                setError('Failed to load product details');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };


    const handleImageChange = (e) => {
        setNewImages([...e.target.files]);
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
    
    
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', Number(product.price));

        if (newImages) {
            Array.from(newImages).forEach((image) => {
                formData.append('images', image);
            });
        }
    
        try {
            console.log('Submitting form data:', formData); // Log form data
            const response = await fetch(`http://localhost:4000/product/${id}`, {
                method: 'PUT',
                body: formData,
            });
    
            if (!response.ok) {
                const responseData = await response.json(); // Check if there's an error message
                throw new Error(`Failed to update product: ${responseData.message}`);
            }
    
            alert('Product updated successfully');
            fetchProducts();//for fetching products again in products context after update.
            navigate(`/your-products`);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <label htmlFor="name">Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="description">Description</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="images">Upload New Images</label>
                    <input
                        type="file"
                        className="form-control-file"
                        id="images"
                        multiple
                        onChange={handleImageChange}
                    />
                    <div className="mt-3">
                        <p>Current Images:</p>
                        <div className="d-flex flex-wrap">
                            {product.images.map((img, index) => (
                                <div key={index} className="mr-2 mb-2">
                                    <img
                                        src={`http://localhost:4000/${img.url}`}
                                        alt="Product"
                                        className="img-thumbnail"
                                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProductPage;
