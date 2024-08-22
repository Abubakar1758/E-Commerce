import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../contexts/UserContext';
import { ProductContext } from '../contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

function CreateProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        images: null,
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { fetchProducts } = useContext(ProductContext);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setFormData((prevData) => ({ ...prevData, [name]: files }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', Number(formData.price));
        formDataToSend.append('userId', user.id); 
        const serialNumber = `SN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        formDataToSend.append('serialNumber', serialNumber);
    
        if (formData.images) {
            Array.from(formData.images).forEach((image) => {
                formDataToSend.append('images', image);
            });
        }
    
        try {
            const response = await fetch('http://localhost:4000/product/create', {
                method: 'POST',
                body: formDataToSend,
            });
    
            const data = await response.json();
            if (response.ok) {
                setSuccess(data.message);
                setError('');
                fetchProducts();//for fetching products again in products context after creating new product.
               
                setTimeout(() => {
                    navigate('/');
                }, 2000);
             
            } else {
                setError(data.message || 'An error occurred.');
                setSuccess('');
            }
        } catch (error) {
            setError('An error occurred while creating the product.');
            setSuccess('');
            console.error('Error:', error);
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 col-lg-6 mx-auto">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Create Product</h2>

                            {success && <div className="alert alert-success">{success}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="form-group mb-4">
                                    <label htmlFor="name">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Enter product name"
                                        value={formData.name}
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
                                        placeholder="Enter product description"
                                        value={formData.description}
                                        onChange={handleChange}
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
                                        placeholder="Enter product price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label htmlFor="images">Product Images</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="images"
                                        name="images"
                                        multiple
                                        onChange={handleChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary btn-block mb-3">
                                    Create Product
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProductPage;
