import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloggerPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/blogger/v3/blogs/3185259583519338460/posts', {
                    params: {
                        key: 'AIzaSyBZJpGBYasuvDVg25Mi7dffmG-llYDZi7k',
                    },
                });
                setPosts(response.data.items);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error fetching posts</div>;

    return (
        <div>
            <h1>Blogger Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BloggerPosts;
