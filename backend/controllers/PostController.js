const axios = require('axios');
const { google } = require('googleapis');
const blogger = google.blogger('v3');
const logAction = require('../utils/logAction');


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
    try {
        const blogger = google.blogger({
            version: 'v3',
            auth: oauth2Client,
        });
  
        const response = await blogger.posts.list({
            blogId: process.env.BLOG_ID,
        });
  
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message); 
        res.status(500).json({ error: error.response ? error.response.data : error.message });
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