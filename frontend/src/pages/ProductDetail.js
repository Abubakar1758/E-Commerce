import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../contexts/UserContext';
import { CartContext } from '../contexts/CartContext'; // Import CartContext
import Comment from '../components/Comment';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [quantity, setQuantity] = useState(1); // State to manage quantity
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const { user } = useContext(UserContext); // Get the current user from context
  const { addToCart } = useContext(CartContext); // Get addToCart function from CartContext
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/product/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
          setComments(data.comments);
        } else {
          console.error('Failed to fetch product details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (newComment.trim() === '') return;

    try {
      const response = await fetch(`http://localhost:4000/product/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment, userId, productId: product.id }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prevComments) => [...prevComments, comment]);
        setNewComment('');
      } else {
        console.error('Failed to add comment:', await response.json());
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:4000/product/${id}/comment/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      } else {
        console.error('Failed to delete comment:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditComment = async (commentId, updatedContent) => {
    try {
      const response = await fetch(`http://localhost:4000/product/${id}/comment/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, content: updatedContent } : comment
          )
        );
      } else {
        console.error('Failed to update comment:', await response.json());
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSuccessMessage('Item added to cart successfully!');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(1, prevQuantity + change);
      console.log('Updated Quantity:', newQuantity); // Log new quantity
      return newQuantity;
    });
  };

  const toggleShowAllComments = () => {
    setShowAllComments(!showAllComments);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const isOwner = product.userId === userId;
  const commentsToShow = showAllComments ? comments : comments.slice(0, 3);

  const imageSrc = product.images.length > 0
    ? `http://localhost:4000/${product.images[currentImage].url}`
    : '/assets/default-product.png';

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="img-container" style={{ position: 'relative', marginBottom: '20px', height: '500px' }}>
            <img
              src={imageSrc}
              alt={product.name}
              className="img-fluid"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
          {product.images.length > 1 && (
            <div className="d-flex mt-3">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/${image.url}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`img-thumbnail ${index === currentImage ? 'active' : ''}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    cursor: 'pointer',
                    marginRight: '10px',
                    borderRadius: '5px',
                    boxShadow: index === currentImage ? '0px 0px 10px rgba(0, 0, 0, 0.3)' : 'none',
                    border: index === currentImage ? '2px solid #007bff' : '1px solid #ddd',
                  }}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
          {!isOwner && (
            <div className="mt-4">
              <div className="d-flex align-items-center mb-3">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => handleQuantityChange(-1)}
                  style={{ marginRight: '10px' }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{quantity}</span>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => handleQuantityChange(1)}
                  style={{ marginLeft: '10px' }}
                >
                  +
                </button>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleAddToCart}
                style={{ width: '100%' }}
              >
                Add to Cart
              </button>
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>{product.name}</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '20px' }}>{product.description}</p>
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', marginBottom: '20px' }}>${product.price}</h3>
          <div>
            <h4>Comments</h4>
            {commentsToShow.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
                onEdit={handleEditComment}
                isOwner={comment.userId === userId}
              />
            ))}
            {comments.length > 3 && (
              <button onClick={toggleShowAllComments} className="btn btn-link">
                {showAllComments ? 'Show Less' : 'Read More Comments'}
              </button>
            )}
          </div>
          {!isOwner && (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={handleCommentChange}
                placeholder="Add a comment"
                className="form-control"
                style={{ marginBottom: '10px', resize: 'none', height: '100px' }}
              />
              <button type="submit" className="btn btn-primary">
                Add Comment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
