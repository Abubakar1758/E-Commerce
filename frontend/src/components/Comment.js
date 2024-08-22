import React, { useState, useEffect, useContext } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { UserContext } from '../contexts/UserContext';

const Comment = ({ comment, onDelete, onEdit }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/user/${comment.userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user name:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    fetchUserInfo();
  }, [comment.userId]);

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isOwner = user?.id === comment.userId;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  return (
    <li className="media mb-3" style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', position: 'relative' }}>
      <img
        src={userInfo?.displayPicture ? `http://localhost:4000${userInfo.displayPicture}` : '/assets/default-avatar.png'}
        alt={userInfo?.name || 'User Avatar'}
        className="mr-3 rounded-circle"
        style={{
          width: '50px',
          height: '50px',
          objectFit: 'cover',
          border: '2px solid #ddd',
        }}
      />
      <div className="media-body">
        <h5 className="mt-0 mb-1">{userInfo?.name || 'Unknown User'}</h5>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{formattedDate}</p>
        {isEditing ? (
          <textarea
            className="form-control"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="2"
          />
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
      {isOwner && (
        <div style={{ position: 'absolute', top: '0', right: '0' }}>
          {isEditing ? (
            <button className="btn btn-success btn-sm" onClick={handleSaveEdit}>
              Save
            </button>
          ) : (
            <>
              <FaEdit
                style={{ cursor: 'pointer', marginRight: '10px', color: '#007bff' }}
                onClick={handleEdit}
              />
              <FaTrashAlt
                style={{ cursor: 'pointer', color: '#dc3545' }}
                onClick={() => onDelete(comment.id)}
              />
            </>
          )}
        </div>
      )}
    </li>
  );
};

export default Comment;
