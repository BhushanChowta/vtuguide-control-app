import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnalyticsComponent from '../components/AnalyticsComponent';
import BloggerPosts from '../components/BloggerPosts';
import { AuthContext } from '../contexts/AuthContext';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material'; // Import Material-UI components

const Dashboard = () => {
  const { blogs, setBlogs, selectedBlogId, setSelectedBlogId, accessToken, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBlogSelect = async (blogId) => {
    setSelectedBlogId(blogId);
  };

  // Sign-out function
  const handleSignOut = () => {
    setBlogs([]);
    setSelectedBlogId(null);
    setAccessToken(null);
    setAnalyPropertyId(null);
    navigate('/');
  };

  return (
    <div>
      {!selectedBlogId && accessToken && (
        <div>
          <Typography variant="h5" gutterBottom>
            Select a Blog:
          </Typography>
          {blogs.length > 0 ? (
            <List>
              {blogs.map((blog) => (
                <ListItem button key={blog.id} onClick={() => handleBlogSelect(blog.id)}>
                  <ListItemText primary={blog.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No blogs found.</Typography>
          )}
        </div>
      )}

      {selectedBlogId && (
        <div>
          <Button component={Link} to="/dashboard" variant="outlined" size="small" color="primary" sx={{ mr: 1 }}>
            Dashboard
          </Button>
          <Button component={Link} to="/actionlogs" variant="outlined" size="small" color="primary" sx={{ mr: 1 }}>
            Action Logs
          </Button>
          <Button component={Link} to="/create-post" variant="outlined" size="small" color="primary" sx={{ mr: 1 }}>
            Create New Post
          </Button>
          <Button onClick={handleSignOut} variant="outlined" size="small" color="secondary">
            Sign Out
          </Button>
          <AnalyticsComponent />
          <BloggerPosts />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
