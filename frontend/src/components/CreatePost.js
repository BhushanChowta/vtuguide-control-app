import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Typography, TextField, Button, Container, Box } from '@mui/material'; 

const CreatePost = () => {
  const { selectedBlogId: blogId, accessToken } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-post`, {
        blogId,
        title,
        content,
        accessToken
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
            Create New Post
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
                {loading ? 'Creating...' : 'Create Post'}
            </Button>
            </form>

            {error && (
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                Error: {error}
            </Typography>
            )}
            {success && (
            <Typography variant="body1" color="success" sx={{ mt: 2 }}>
                Post created successfully!
            </Typography>
            )}
        </Box>
        </Container>
    </div>
  );
};

export default CreatePost;
