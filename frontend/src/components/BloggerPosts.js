import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BloggerPosts = ({ onEdit }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/api/posts');
                setPosts(response.data.items);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;
        
        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/delete-post/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Blogger Posts</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h3>{post.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        <button onClick={() => onEdit(post)}>Edit</button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BloggerPosts;
