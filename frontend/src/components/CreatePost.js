import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Typography, TextField, Button, Container, Box, Alert } from '@mui/material';

const CreatePost = () => {
  const { selectedBlogId: blogId, accessToken } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  // Removed useEffect that was automatically generating content

  const generateContent = async () => { // Changed to be triggered by button click
    setGenerating(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/generate-content`, { title });
      setContent(response.data.formattedContent);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  };

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
        accessToken,
      });

      if (response.status === 200) {
        setSuccess(true);
        navigate(`/post/${response.data.id}`); 
      }
    } catch (error) {
      setError(error.message || 'An error occurred while creating the post.');
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
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              margin="normal"
            />
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={generateContent} 
              disabled={!title || generating}
              sx={{ mt: 2 }}
            >
              {generating ? 'Generating...' : 'Generate Content'}
            </Button>
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
              placeholder="Start typing or edit generated content" 
            />
            <Button
              type="submit"
              disabled={loading || generating}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </Button>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Post created successfully!
            </Alert>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default CreatePost;
