import React, { useState } from 'react';
import axios from 'axios';

const EditPost = ({ blogId, postId, existingTitle, existingContent, accessToken }) => {
  const [title, setTitle] = useState(existingTitle);
  const [content, setContent] = useState(existingContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.put(`http://localhost:5000/api/edit-post/${postId}`, {
        title: title,
        content: content,
        accessToken: accessToken, // Pass the access token
        blogId: blogId // Pass the blog ID
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
      <h1>Edit Post</h1>
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
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
      {success && <p>Post updated successfully!</p>}
    </div>
  );
};

export default EditPost;
