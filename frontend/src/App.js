import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import GoogleProvider from './components/GoogleProvider';
import GoogleLoginComponent from './components/GoogleLoginComponent';
import AnalyticsComponent from './components/AnalyticsComponent';
import CreatePost from './components/CreatePost';
import axios from 'axios';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [accessToken, setAccessToken] = useState(null); 
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [posts, setPosts] = useState([]);

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
                    <li key={post.id}>{post.title}</li>
                  ))}
                </ul>
              ) : (
                <p>No posts found.</p>
              )}
              <Link to="/create-post">Create New Post</Link>
            </div>
          )}
        </div>
        <Routes>
          <Route path="/create-post" element={<CreatePost blogId={selectedBlogId} accessToken={accessToken} />} />
        </Routes>
      </Router>
    </GoogleProvider>
  );
};

export default App;

// import React, { useState } from 'react';
// import BloggerPosts from './components/BloggerPosts';
// import CreatePost from './components/CreatePost';
// import EditPost from './components/EditPost';

// const App = () => {
//     const [editingPost, setEditingPost] = useState(null);

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h1>My Blogger Posts</h1>
//             </header>
//             <main>
//                 <CreatePost />
//                 {editingPost && (
//                     <EditPost 
//                         postId={editingPost.id} 
//                         existingTitle={editingPost.title} 
//                         existingContent={editingPost.content} 
//                         onClose={() => setEditingPost(null)}
//                     />
//                 )}
//                 <BloggerPosts onEdit={setEditingPost} />
//             </main>
//         </div>
//     );
// };

// export default App;

