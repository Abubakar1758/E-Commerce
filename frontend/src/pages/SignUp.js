import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../contexts/UserContext';

function SignUpPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        displayPicture: '',
        role: 'buyer',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { loginUser } = useContext(UserContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({ ...prevData, displayPicture: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('displayPicture', formData.displayPicture);
        formDataToSend.append('role', formData.role);

        try {
            const response = await fetch('http://localhost:4000/user/signup', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess('Sign-up successful!');
                setError('');

                loginUser({
                    name: data.user.name,
                    role: data.user.role,
                    displayPicture: data.user.displayPicture,
                    id: data.user.id,
                });


                navigate('/');


                console.log('Response from server:', data);
            } else {
                const errorData = await response.json();
                setError(`Error: ${errorData.message}`);
                setSuccess('');
            }
        } catch (error) {
            setError('An error occurred while signing up.');
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
                            <h2 className="card-title text-center mb-4">Sign Up</h2>

                            {success && <div className="alert alert-success">{success}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-4">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter your first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter your last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

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
                                    <label htmlFor="displayPicture">Display Picture</label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="displayPicture"
                                        onChange={handleFileChange}
                                    />
                                    {formData.displayPicture && (
                                        <div className="mt-3 text-center">
                                            <img
                                                src={URL.createObjectURL(formData.displayPicture)}
                                                alt="Display Preview"
                                                className="img-thumbnail rounded-circle"
                                                style={{ width: '150px', height: '150px' }}
                                            />
                                        </div>
                                    )}
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

                                <div className="form-group mb-4">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <fieldset className="form-group mb-4">
                                    <legend>Role</legend>
                                    <div className="form-check mb-2">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="buyer"
                                            name="role"
                                            value="buyer"
                                            checked={formData.role === 'buyer'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="buyer">
                                            Buyer
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="seller"
                                            name="role"
                                            value="seller"
                                            checked={formData.role === 'seller'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="seller">
                                            Seller
                                        </label>
                                    </div>
                                </fieldset>

                                <button type="submit" className="btn btn-primary btn-block mb-3">
                                    Sign Up
                                </button>

                                <p className="text-center">
                                    Already a member? <a href="/login">Log In</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
