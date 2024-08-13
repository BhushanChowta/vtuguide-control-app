import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const EditPost = () => {
  const { postId } = useParams(); // Get postId from route parameters
  const { selectedBlogId: blogId, accessToken } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (postId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogger/posts/${postId}`, {
            params: {
              blogId,
              accessToken,
            },
          });
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
        } catch (error) {
          console.error('Error fetching post details:', error);
        }
      }
    };

    fetchPostDetails();
  }, [postId, blogId, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/edit-post/${postId}`, {
        title,
        content,
        accessToken,
        blogId,
      });

      if (response.status === 200) {
        setSuccess(true);
        navigate(`/post/${response.data.id}`); // Redirect to the Post Show Page
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {success && <p>Post updated successfully!</p>}
    </div>
  );
};

export default EditPost;
