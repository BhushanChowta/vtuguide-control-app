import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Button, Box, Typography } from '@mui/material';

const Header = () => {
  const { userInfo, selectedBlogId, setUserInfo, setBlogs, setSelectedBlogId, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
  const navigate = useNavigate();

  // Sign-out function
  const handleSignOut = () => {
    setBlogs([]);
    setUserInfo(null);
    setSelectedBlogId(null);
    setAccessToken(null);
    setAnalyPropertyId(null);
    navigate('/');
  };

  return (
    <div>
      {selectedBlogId && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}> 
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
            <Button component={Link} to="/postSubmissions" variant="outlined" size="small" color="primary" sx={{ mr: 1 }}>
              Submissions
            </Button>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Container for username and signout */}
            {userInfo && ( 
              <>
                {/* <Typography variant="subtitle1" sx={{ mr: 2 }}>Hello, {userInfo['name']}!</Typography> */}
                {userInfo['picture'] && (
                  <img 
                    src={userInfo['picture']} 
                    alt="Profile" 
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} 
                    onError={(e) => { e.target.onerror = null; e.target.src = `${userInfo['picture']}` ; }} //https://via.placeholder.com/30x30?text=
                  />
                )}
              </>
            )}
            <Button onClick={handleSignOut} variant="outlined" size="small" color="secondary">
              Sign Out
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Header;
