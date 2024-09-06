import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams
import { Typography, TextField, Button, Container, Box, Paper } from '@mui/material';

const PublicBlogSubmission = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { blogId } = useParams(); // Get blogId from route parameters

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contribute-post`, {
        blogId,
        title,
        content,
      });

      if (response.status === 200) {
        setSuccess(true);
        // Reset the form or redirect
        setTitle('');
        setContent('');
        // ... reset other fields
      }
    } catch (error) {
      setError(error.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 2, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Submit Your Blog Post
        </Typography>

        {/* Success Message */}
        {success && (
          <Typography variant="body1" color="success" sx={{ mt: 2 }}>
            Thank you for your submission! It will be reviewed shortly.
          </Typography>
        )}

        {/* Form */}
        {!success && ( 
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

            <TextField
              label="Content (+Drive Link)"
              multiline
              rows={10} 
              variant="outlined"
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              margin="normal"
            />
            
            <Button type="submit" disabled={loading} variant="contained" color="primary" sx={{ mt: 2 }}>
              {loading ? 'Submitting...' : 'Submit Post'}
            </Button>

            {error && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default PublicBlogSubmission;
