import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const BloggerPosts = () => {
    const { blogs, selectedBlogId, setSelectedBlogId, accessToken } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
              const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogger/posts`, {
                params: {
                    blogId: selectedBlogId, 
                    accessToken,
                },
              });
            //   console.log('Blog posts:', response.data);
              setPosts(response.data.items ?? []);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, [selectedBlogId, accessToken]);

    return (
        <div>
            <h2>Blogger Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    {error && <p>Error: {error}</p>}
                    {loading && <p>Loading...</p>}
                    {!loading && <p>No posts found.</p>}
                </>
            )}
        </div>
    );
};

export default BloggerPosts;
