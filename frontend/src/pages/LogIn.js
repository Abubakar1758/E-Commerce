import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { ProductContext } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { loginUser } = useContext(UserContext);
    const { fetchProducts } = useContext(ProductContext);

    // Load saved email and password from localStorage if "rememberMe" was checked
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');

        if (savedEmail && savedPassword) {
            setFormData((prevData) => ({
                ...prevData,
                email: savedEmail,
                password: savedPassword,
                rememberMe: true,
            }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                setError('');

                loginUser({
                    name: data.user.name,
                    role: data.user.role,
                    displayPicture: data.user.displayPicture,
                    id: data.user.id,
                });

                fetchProducts();

                // Save credentials to localStorage if "rememberMe" is checked
                if (formData.rememberMe) {
                    localStorage.setItem('rememberedEmail', formData.email);
                    localStorage.setItem('rememberedPassword', formData.password);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }

                navigate('/');
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message}`);
                setSuccess('');
            }
        } catch (error) {
            setError('An error occurred while logging in.');
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
                            <h2 className="card-title text-center mb-4">Log In</h2>

                            {success && <div className="alert alert-success">{success}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-4">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label htmlFor="password">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-check mb-4">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember Me
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-block mb-3">
                                        Log In
                                    </button>

                                    <div className="text-center">
                                    <a href="/forgot-password">Forgot Password?</a>
                                        <br />
                                        <Link to="/signup">Not a member? Sign Up                                        </Link>
                                    </div>
                                </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
