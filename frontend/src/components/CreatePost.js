import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ blogId, accessToken }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:5000/api/create-post', {
                blogId,
                title,
                content,
                accessToken
            });

            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
            {error && <p>Error: {error}</p>}
            {success && <p>Post created successfully!</p>}
        </div>
    );
};

export default CreatePost;
