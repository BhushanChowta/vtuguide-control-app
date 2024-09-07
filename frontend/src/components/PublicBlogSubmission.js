import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Box,
  Collapse, 
  IconButton 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import ExpandMore icon

const PublicBlogSubmission = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { blogId } = useParams(); 

  const [showTemplate, setShowTemplate] = useState(false);
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
        setTitle('');
        setContent('');
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

        <Typography variant="body2" color="textSecondary" gutterBottom>
          **Disclaimer:** All submissions will be reviewed before publishing. 
        </Typography>

        {success && (
          <Typography variant="body1" color="success" sx={{ mt: 2 }}>
            Thank you for your submission! It will be reviewed shortly.
          </Typography>
        )}

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

            {/* Template Section */}
            {/* Template Section (Dropdown) */}
            <Box sx={{ mt: 2, border: '1px solid #ccc', p: 2, borderRadius: 4 }}>
              <Typography variant="subtitle1" gutterBottom onClick={() => setShowTemplate(!showTemplate)}>
                Example Template 
                <IconButton size="small" sx={{ ml: 1 }}>
                  <ExpandMoreIcon sx={{ transform: showTemplate ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </IconButton>
              </Typography>

              {/* Collapsible Content */}
              <Collapse in={showTemplate}>
                <Typography variant="body2">
                  You can use this template to format your content:
                </Typography>
                <pre>
{`
<div class="separator" style="clear: both; text-align: center;">
  <a href="IMAGE_URL_HERE" style="margin-left: 1em; margin-right: 1em;">
    <img border="0" data-original-height="360" data-original-width="660" height="175" src="" width="320" />
  </a>
</div>
<p>DESCRIPTION HERE</p>
<iframe allow="autoplay" height="480" width="640"
  src="https://drive.google.com/file/d/YOUR_DRIVE_LINK_HERE/preview" 
></iframe>
`}
                </pre>
              </Collapse>
            </Box>

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
