import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import GoogleProvider from './components/GoogleProvider';
import GoogleLoginComponent from './components/GoogleLoginComponent';
import AnalyticsComponent from './components/AnalyticsComponent';
import axios from 'axios';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { blogs, setBlogs, accessToken, setAccessToken, selectedBlogId, setSelectedBlogId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

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
      const response = await axios.get('http://localhost:5000/api/blogger/posts', {
        params: {
          blogId,
          accessToken
        }
      });
      console.log('Blog posts:', response.data);
      setPosts(response.data.items ?? []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete the post "${postTitle}" from the blog "${blogs.find(blog => blog.id === selectedBlogId)?.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/delete-post/${postId}`, {
        data: {
          blogId: selectedBlogId,
          accessToken,
        },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <GoogleProvider>
      <div className="App">
        {!accessToken &&
          <GoogleLoginComponent />
        }
        {accessToken && !selectedBlogId && (
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
        {selectedBlogId && <AnalyticsComponent />}
        {selectedBlogId && (
          <div>
            <h2>Posts for Selected Blog:</h2>
            {posts.length > 0 ? (
              <ul>
                {posts.map((post) => (
                  <li key={post.id}>
                    {post.title}
                    <Link to={`/edit-post/${post.id}`} onClick={() => setSelectedPost(post)}>Edit</Link>
                    {post.status === 'DRAFT' && <button onClick={() => handleDeletePost(post.id, post.title)}>Delete</button>}
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
      <Outlet />
    </GoogleProvider>
  );
};

export default App;
