import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Grid, Typography } from '@mui/material'; 

const BloggerPosts = () => {
    const { blogs, selectedBlogId, accessToken, setBlogs, setSelectedBlogId, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
              const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
                params: {
                    blogId: selectedBlogId, 
                    accessToken,
                },
              });
              console.log('Blog posts:', response.data);
              // Map through posts to extract image URLs from content
              const postsWithImages = response.data.items.map(post => ({
                  ...post,
                  imageUrl: extractImageUrl(post.content),
              }));
              setPosts(postsWithImages);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized. Signing out...');
                    setBlogs([]);
                    setSelectedBlogId(null);
                    setAccessToken(null);
                    setAnalyPropertyId(null);
                    navigate('/'); 
                } else {
                    setError(error.message);
                    console.error('Error fetching blog posts:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, [selectedBlogId, accessToken]);

    const extractImageUrl = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgTag = doc.querySelector('img'); // Get the first img tag in the content
        if (imgTag) {
            return imgTag.src; // Return the src of the img tag
        }
        const aTag = doc.querySelector('a'); // Fallback to the first a tag if no img found
        if (aTag && aTag.href) {
            return aTag.href; // Return the href of the a tag
        }
        return "https://via.assets.so/img.jpg"; // If no image or href found
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Recent Blogger Posts
            </Typography>
            {posts.length === 0 && ( 
                <>
                    {error && <Typography variant="body1">Error: {error}</Typography>}
                    {loading && <Typography variant="body1">Loading...</Typography>}
                    {!loading && !error && <Typography variant="body1">No Post Found</Typography>} 
                </>
            )}
            <Grid container spacing={2}> 
                {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}> {/* Responsive grid items */}
                    <Box
                    sx={{
                        border: `1px solid ${post.status === 'DRAFT' ? 'orange' : '#ccc'}`, // Conditional border color
                        borderRadius: '4px',
                        p: 2,
                        '&:hover': {
                        boxShadow: 3, // Add a box shadow on hover
                        },
                    }}
                    >
                    <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
                        {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        )}
                        <Typography variant="h6" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} gutterBottom >
                            {post.title}    
                        </Typography>
                    </Link>
                    {post.status === 'DRAFT' && (
                        <Typography variant="caption" color="textSecondary">
                        Draft
                        </Typography>
                    )}
                    </Box>
                </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BloggerPosts;
