import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AnalyticsComponent from '../components/AnalyticsComponent';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { blogs, selectedBlogId, setSelectedBlogId, accessToken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (selectedBlogId && accessToken) {
      fetchBlogPosts(selectedBlogId);
    }
  }, [selectedBlogId, accessToken]);

  const handleBlogSelect = async (blogId) => {
    setSelectedBlogId(blogId);
    await fetchBlogPosts(blogId);
  };

  const fetchBlogPosts = async (blogId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogger/posts`, {
        params: {
          blogId,
          accessToken,
        },
      });
    //   console.log('Blog posts:', response.data);
      setPosts(response.data.items ?? []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  return (
    <div>
      {selectedBlogId && <AnalyticsComponent />}
      {!selectedBlogId && (
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
      {selectedBlogId && (
        <div>
          <h2>Posts for Selected Blog:</h2>
          {posts.length > 0 ? (
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No posts found.</p>
          )}
          <Link to="/create-post">Create New Post</Link>
        </div>
      )}
      {selectedBlogId && <Link to="/actionlogs">Action Logs</Link>}
    </div>
  );
};

export default Dashboard;
