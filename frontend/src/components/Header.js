import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '@mui/material';

const Header = () => {
  const { selectedBlogId, setBlogs, setSelectedBlogId, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
  const navigate = useNavigate();

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
        </div>
      )}
    </div>
  );
};

export default Header;