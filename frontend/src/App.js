import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import GoogleProvider from './components/GoogleProvider';
import GoogleLoginComponent from './components/GoogleLoginComponent';
import AnalyticsComponent from './components/AnalyticsComponent';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost'; 
import ActionLogs from './pages/ActionLogs';
import axios from 'axios';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [accessToken, setAccessToken] = useState(null); 
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Add state for selected post

  const handleBlogSelect = async (blogId) => {
    setSelectedBlogId(blogId);
    await fetchBlogPosts(blogId);
  };

  const fetchBlogPosts = async (blogId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogger/posts', {
        params: {
          blogId,
          accessToken: accessToken // Pass the access token as a query parameter
        }
      });
      console.log('Blog posts:', response.data);
      setPosts(response.data.items ?? []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete the post "${postTitle}" from the blog "${blogs.find(blog => blog.id === selectedBlogId).name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/delete-post/${postId}`, {
        data: {
          blogId: selectedBlogId,
          accessToken: accessToken,
        },
      });
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <GoogleProvider>
      <Router>
        <div className="App">
          {!accessToken &&
            <GoogleLoginComponent setBlogs={setBlogs} setAccessToken={setAccessToken} setSelectedBlogId={setSelectedBlogId} />
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
          {selectedBlogId && <AnalyticsComponent accessToken={accessToken} />}
          {selectedBlogId && (
            <div>
              <h2>Posts for Selected Blog:</h2>
              {posts.length > 0 ? (
                <ul>
                  {posts.map((post) => (
                    <li key={post.id}>
                      {post.title}
                      <Link to={`/edit-post/${post.id}`} onClick={() => setSelectedPost(post)}>Edit</Link>
                      {post.status=='DRAFT' && <button onClick={() => handleDeletePost(post.id, post.title)}>Delete</button>}
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
        <Routes>
          <Route path="/create-post" element={<CreatePost blogId={selectedBlogId} accessToken={accessToken} />} />
          <Route path="/edit-post/:postId" element={<EditPost blogId={selectedBlogId} accessToken={accessToken}  postId={selectedPost?.id} existingTitle={selectedPost?.title} existingContent={selectedPost?.content} />} />
          <Route path="/actionlogs" element={<ActionLogs blogId={selectedBlogId} accessToken={accessToken} />} />
        </Routes>
      </Router>
    </GoogleProvider>
  );
};

export default App;
