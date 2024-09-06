import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnalyticsComponent from '../components/AnalyticsComponent';
import BloggerPosts from '../components/BloggerPosts';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header'; // Import the Header component
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
      <Header />

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
          <AnalyticsComponent />
          <BloggerPosts />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
