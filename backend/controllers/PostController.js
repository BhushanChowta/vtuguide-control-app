const axios = require('axios');
const { google } = require('googleapis');
const blogger = google.blogger('v3');
const logAction = require('../utils/logAction');
const Post = require('../models/Post'); // Import your Post model


exports.createPost = async (req, res) => {
    const { blogId, title, content, accessToken } = req.body;
    const userId = await fetchGoogleUserId(accessToken);
  
    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
    
        const response = await blogger.posts.insert({
          auth: oauth2Client,
          blogId: blogId,
          requestBody: {
            title: title,
            content: content,
          },
          isDraft: true, // Set the post to be a draft
        });
  
        logAction(userId, 'CREATE_POST', blogId, response.data.id);
  
        res.status(200).json(response.data);
      } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
  }

exports.getPosts = async (req, res) => {
  const { blogId, accessToken } = req.query;

  try {
    const response = await axios.get(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?status=live&status=draft`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}

exports.getPost = async (req, res) => {
  const { postId } = req.params; // Get postId from URL parameters
  const { blogId, accessToken } = req.query; // Get blogId and accessToken from query parameters

  try {
    const response = await axios.get(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    // If fails, fallback to fetching drafts
    try {
      response = await axios.get(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?status=draft`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      // Find the draft post that matches the postId
      const post = response.data.items.find(p => p.id === postId);
      if (post) {
        return res.json(post);
      } else {
        return res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      return res.status(error.response?.status || 500).json({ error: error.message });
    }
  }
}

exports.editPost = async (req, res) => {
    const { postId } = req.params;
    const { title, content, accessToken, blogId } = req.body;
    const userId = await fetchGoogleUserId(accessToken);
  
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
  
      const response = await blogger.posts.update({
        auth: oauth2Client,
        blogId: blogId,
        postId: postId,
        requestBody: {
          title: title,
          content: content,
        },
      });
  
      logAction(userId, 'EDIT_POST', blogId, postId);
  
      res.status(200).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  }

exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    const { accessToken, blogId } = req.body;
    const userId = await fetchGoogleUserId(accessToken);
  
    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
  
        const response = await blogger.posts.delete({
          auth: oauth2Client,
          blogId: blogId,
          postId: postId,
        });
        // res.status(200).json(response.data);
  
        logAction(userId, 'DELETE_POST', blogId, postId);
  
        res.status(200).json({ message: `${postId} Post deleted successfully` });
    } catch (error) {
        console.error('Error deleting post:', error.response ? error.response.data : error.message); // Log the error details
        res.status(500).json({ error: error.response ? error.response.data : error.message });
    }
  }

exports.contributePost = async (req, res) => {
  try {
    const { blogId, title, content } = req.body;

    // 1. Validate form data (you can use a validation library like Joi)
    if (!blogId || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // 2. Create a new post document
    const newPost = new Post({
      blogId,
      title,
      content,
    });

    // 3. Save the post to the database
    const savedPost = await newPost.save();

    // 4. Send a success response
    res.status(200).json({ 
      message: 'Post submitted successfully!', 
      postId: savedPost._id 
    });

  } catch (error) {
    console.error('Error submitting post:', error);
    res.status(500).json({ message: 'An error occurred during submission.' });
  }
};

const fetchGoogleUserId = async (accessToken) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.sub; // User ID from Google
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };