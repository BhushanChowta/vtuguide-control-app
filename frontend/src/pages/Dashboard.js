import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnalyticsComponent from '../components/AnalyticsComponent';
import BloggerPosts from '../components/BloggerPosts';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header'; // Import the Header component
import { List, Button, Typography, Box, Paper, CircularProgress } from '@mui/material'; 

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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}> {/* Use Paper for a card-like style */}
            <Typography variant="h5" gutterBottom>
              Select a Blog to Get Started
            </Typography>
            {blogs.length == 0 ? ( // Conditionally render loading or blog list
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress /> {/* Show loading indicator */}
              </Box>
            ) : (
              blogs.length > 0 ? (
                <List>
                  {blogs.map((blog) => (
                  <Button variant="contained"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
                   onClick={() => handleBlogSelect(blog.id)}>
                    {blog.name}
                  </Button>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">No blogs found.</Typography>
              )
            )}
          </Paper>
        </Box>
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
