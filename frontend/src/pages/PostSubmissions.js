import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Box, Grid, Typography, Button } from '@mui/material';
import Header from '../components/Header'; 

const PostSubmissions = () => {
    const { blogs, selectedBlogId, accessToken, setBlogs, setSelectedBlogId, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissionBlogPosts = async () => {
            try {
                setLoading(true);
              const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/postSubmissions`, {
                params: {
                    blogId: selectedBlogId, 
                    accessToken,
                },
              });
              // Map through posts to extract image URLs from content
              const postsWithImages = response.data.map(post => ({
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

        fetchSubmissionBlogPosts();
    }, [selectedBlogId, accessToken]);

    const extractImageUrl = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgTag = doc.querySelector('img'); // Get the first img tag in the content
        if (imgTag) {
            return imgTag.src; // Return the src of the img tag
        }
        return "https://via.assets.so/img.jpg"; // If no image or href found
    };

    const handleCreatePost = async (post) => {
        setLoading(true);
        setError(null);

        try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/create-post`, {
            blogId: selectedBlogId,
            title: post.title,
            content: post.content,
            submissionId: post._id,
            accessToken
        });

        if (response.status === 200) {
            navigate(`/post/${response.data.id}`); 
        }
        } catch (error) {
        setError(error.message);
        } finally {
        setLoading(false);
        }
    };
    
    return (
        <>
        <Header /> 
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Posts Submissions
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
                <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
                  <Box
                    sx={{
                      border: `1px solid ${post.status === 'REVIEWED' ? 'orange' : '#ccc'}`,
                      borderRadius: '4px',
                      p: 2,
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    {post.blogPostID ? (
                    <Link to={`/post/${post.blogPostID}`} style={{ textDecoration: 'none' }}>
                        {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        )}
                        <Typography variant="h6" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} gutterBottom>
                        {post.title}
                        </Typography>
                    </Link>
                    ) : ( 
                    <> 
                        {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        )}
                        <Typography variant="h6" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }} gutterBottom>
                        {post.title}
                        </Typography>
                    </>
                    )}
                    {!post.blogPostID &&
                        <Button variant="contained" color="primary" onClick={() => handleCreatePost(post)}>
                        {loading ? 'Dumping...' : 'Dump Post'}
                        </Button>
                    }
                  </Box>
                </Grid>
              ))}
            </Grid>
        </Box>
        </>
    );
};

export default PostSubmissions;
