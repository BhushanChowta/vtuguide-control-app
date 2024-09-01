import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnalyticsComponent from '../components/AnalyticsComponent';
import BloggerPosts from '../components/BloggerPosts';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { blogs, selectedBlogId, setSelectedBlogId, accessToken } = useContext(AuthContext);



  const handleBlogSelect = async (blogId) => {
    setSelectedBlogId(blogId);
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
      {selectedBlogId && <AnalyticsComponent />}
      {selectedBlogId && <BloggerPosts />}
    </div>
  );
};

export default Dashboard;
