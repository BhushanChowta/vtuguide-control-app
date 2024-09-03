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
              console.log('Blog posts:', response.data);
              // Map through posts to extract image URLs from content
              const postsWithImages = response.data.items.map(post => ({
                  ...post,
                  imageUrl: extractImageUrl(post.content),
              }));
              setPosts(postsWithImages);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts();
    }, [selectedBlogId, accessToken]);

    const extractImageUrl = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imgTag = doc.querySelector('img'); // Get the first img tag in the content
        if (imgTag) {
            return imgTag.src; // Return the src of the img tag
        }
        const aTag = doc.querySelector('a'); // Fallback to the first a tag if no img found
        if (aTag && aTag.href) {
            return aTag.href; // Return the href of the a tag
        }
        return "https://via.assets.so/img.jpg?w=400&h=200&tc=blue&bg=#cecece&t=placeholder"; // If no image or href found
    };

    return (
        <div className="blogger-posts-container">
            <h2>Recent Blogger Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    <div className="post-cards">
                        {posts.map((post) => (
                            <div key={post.id} className={`post-card ${post.status === 'DRAFT' ? 'draft' : ''}`}>
                                {post.status === 'DRAFT' && <span className="draft-label">Draft</span>}
                                <Link to={`/post/${post.id}`} className="post-link">
                                    {post.imageUrl && (
                                        <div className="post-image">
                                            <img src={post.imageUrl} alt={post.title} />
                                        </div>
                                    )}
                                    <div className="post-content">
                                        <h3>{post.title}</h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
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
