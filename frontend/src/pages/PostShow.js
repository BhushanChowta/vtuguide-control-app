import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const PostShow = () => {
  const { postId } = useParams();
  const { selectedBlogId, accessToken, blogs } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostShows = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`, {
          params: {
            blogId: selectedBlogId,
            accessToken,
          }
        });
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    if (postId && selectedBlogId) {
      fetchPostShows();
    }
  }, [postId, selectedBlogId, accessToken]);

  const handleDeletePost = async (postId, postTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete the post "${postTitle}" from the blog "${blogs.find(blog => blog.id === selectedBlogId)?.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/delete-post/${postId}`, {
        data: {
          blogId: selectedBlogId,
          accessToken,
        },
      });
      navigate('/dashboard'); // Redirect to the Dashboard after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!post) {
    return <p>Loading post details...</p>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <h4>{post.status === 'DRAFT' && <button onClick={() => handleDeletePost(post.id, post.title)}>Delete</button>}</h4>
      <h4><Link to={`/edit-post/${post.id}`}>Edit</Link></h4>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export default PostShow;
