import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ProductCard({ product, canEdit }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [hover, setHover] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommentsCount = async () => {
            try {
                const response = await fetch(`http://localhost:4000/product/${product.id}/comments/count`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCommentsCount(data.count);
            } catch (error) {
                console.error('Failed to fetch comments count:', error);
            }
        };
        fetchCommentsCount();
    }, [product.id]);

    useEffect(() => {
        let imageInterval;
        if (hover && product.images.length > 1) {
            imageInterval = setInterval(() => {
                setCurrentImage(prevImage => (prevImage + 1) % product.images.length);
            }, 2000);
        }
        return () => clearInterval(imageInterval);
    }, [hover, product.images.length]);

    const shortDescription = product.description.length > 100 
        ? product.description.substring(0, 100) + '...'
        : product.description;

    const commentsText = commentsCount === 0
        ? 'No comments'
        : commentsCount === 1
        ? '1 Comment'
        : `${commentsCount} Comments`;

    const imageSrc = product.images.length > 0 
        ? product.images[currentImage] 
        : '/assets/default-product.png';

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:4000/product/${product.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(`Failed to delete product: ${responseData.message}`);
            }

            alert('Product deleted successfully');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    return (
        <div 
            className="card product-card"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ 
                width: '100%', 
                height: '100%',  
                margin: '10px', 
                borderRadius: '10px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                position: 'relative'
            }}
        >
            <div 
                className="img-container"
                style={{
                    height: '200px', 
                    overflow: 'hidden', 
                    position: 'relative'
                }}
            >
                <img 
                    src={imageSrc} 
                    className="card-img-top" 
                    alt={product.name} 
                    style={{ 
                        height: '100%', 
                        width: '100%', 
                        position: 'absolute', 
                        top: '0', 
                        left: '0',
                        objectFit: 'fill',
                        zIndex: 1
                    }} 
                />
            </div>
            <div className="card-body" style={{ flex: '1 1 auto', padding: '15px', display: 'flex', flexDirection: 'column' }}>
                <h5 className="card-title" style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: '0' }}>{product.name}</h5>
                <p 
                    className="card-text" 
                    style={{ 
                        fontSize: '0.9rem', 
                        color: '#555', 
                        margin: '10px 0', 
                        flex: '1',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {shortDescription}
                </p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontSize: '1rem', color: '#000', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
                    <span style={{ fontSize: '0.9rem', color: '#555' }}>{commentsText}</span>
                </div>
            </div>
            {canEdit && (
                <div className="d-flex">
                    <button 
                        className="btn btn-success" 
                        style={{ 
                            width: '50%', 
                            borderRadius: '0',
                            padding: '10px 0',
                            margin: '0'
                        }}
                        onClick={() => navigate(`/product/edit/${product.id}`)}
                    >
                        <FaEdit /> Edit
                    </button>
                    <button 
                        className="btn btn-danger" 
                        style={{ 
                            width: '50%', 
                            borderRadius: '0',
                            padding: '10px 0',
                            margin: '0'
                        }}
                        onClick={handleDelete}
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            )}
            <button 
                className="btn btn-primary" 
                style={{ 
                    backgroundColor: '#007bff', 
                    borderColor: '#007bff', 
                    width: '100%', 
                    borderRadius: canEdit ? '0 0 10px 10px' : '0 0 10px 10px',
                    padding: '10px 0',
                    marginTop: 'auto'
                }}
                onClick={() => navigate(`/product/${product.id}`)}
            >
                View Product
            </button>
        </div>
    );
}

export default ProductCard;
