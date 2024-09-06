import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from './Header';
import { Typography, TextField, Button, Container, Box } from '@mui/material'; // Import Material-UI components

const EditPost = () => {
  const { postId } = useParams();
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
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`, {
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
        navigate(`/post/${response.data.id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <Header />
    <Container maxWidth="md">
      <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}> 
        <Typography variant="h4" gutterBottom>
          Edit Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <div>
            <TextField 
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal" 
            />
          </div>
          <div>
            <TextField 
              label="Content"
              multiline
              rows={10} 
              variant="outlined"
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              margin="normal" 
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            variant="contained" 
            color="primary"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </Button>
        </form>

        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            Error: {error}
          </Typography>
        )}
        {success && (
          <Typography variant="body1" color="success" sx={{ mt: 2 }}>
            Post updated successfully!
          </Typography>
        )}
      </Box>
    </Container>
    </div>
  );
};

export default EditPost;
