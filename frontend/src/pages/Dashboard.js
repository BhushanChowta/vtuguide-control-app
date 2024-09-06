import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import AnalyticsComponent from '../components/AnalyticsComponent';
import BloggerPosts from '../components/BloggerPosts';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { blogs, setBlogs, selectedBlogId, setSelectedBlogId, accessToken, setAccessToken, setAnalyPropertyId } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBlogSelect = async (blogId) => {
    setSelectedBlogId(blogId);
  };

  // Sign-out function
  const handleSignOut = () => {
    setBlogs([]); // Clear the blogs
    setSelectedBlogId(null);
    setAccessToken(null); // Clear the access token
    setAnalyPropertyId(null); // Clear the Analytics property ID

    // Redirect to the home page
    navigate('/');
  };

  return (
    <div>
      {!selectedBlogId && accessToken && (
        <div>
          <h2>Blogs:</h2>
          {blogs.length > 0 ? (
            <ul>
              {blogs.map((blog) => (
                <li key={blog.id} onClick={() => handleBlogSelect(blog.id)}>
                  {blog.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No blogs found.</p>
          )}
        </div>
      )}
      {selectedBlogId && <Link to="/actionlogs">Action Logs</Link>}
      {selectedBlogId && <>||</>}
      {selectedBlogId && <Link to="/create-post">Create New Post</Link>}
      {selectedBlogId &&  
        <button onClick={handleSignOut}>
          Sign Out
        </button>
      }
      {selectedBlogId && <AnalyticsComponent />}
      {selectedBlogId && <BloggerPosts />}
    </div>
  );
};

export default Dashboard;
