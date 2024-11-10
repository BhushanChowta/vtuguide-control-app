import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { TextField, Button, Container, Typography } from '@mui/material';

const SearchPosts = () => {
  const { blogs, selectedBlogId, accessToken, setBlogs, setSelectedBlogId, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [searching, setIsSearching] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/blogger/v3/blogs/${selectedBlogId}/posts/search`,
          {
            params: {
              q: searchQuery,
            },      
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Set the posts to state
        if(response.data.items){
          setIsSearching(false);
          setPosts(response.data.items);
        } else {
          setIsSearching(false);
          setPosts([]);
        }
        setError(null);
      } catch (err) {
        setIsSearching(false);
        setPosts([]);
        setError(err.message);
      }
    };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    fetchPosts();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPosts([]);
    setError(null);
  };

  return (
    <>
    <Header />
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Search Blog Posts
      </Typography>
      <form onSubmit={handleSearch}>
        <TextField
          label="Search Posts"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Search
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={clearSearch} 
          sx={{ ml: 1, mt: 2 }}>
          X
        </Button>
      </form>
      {error && <div>Error fetching posts: {error}</div>}
      {posts.length === 0 ? (
        searching === true ?
        (<p>Searching...</p>):
        (<p>No posts found.</p>)
      ) : (
        <ul>
          {posts.map((post) => (
            <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
                <h4>{post.title}</h4>
            </Link>
          ))}
        </ul>
      )}
    </Container>
    </>
  );
};

export default SearchPosts;
