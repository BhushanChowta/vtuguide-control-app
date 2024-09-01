const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const logAction = require('./utils/logAction');
const ActionLog = require('./models/ActionLog'); 
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const blogger = google.blogger('v3');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});


// MongoDB Connect
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Could not connect to MongoDB Atlas...', err));


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

app.post('/api/blogger', async (req, res) => {
  const { accessToken } = req.body;

  try {
    
  console.log("accessToken",accessToken);
    const response = await axios.get('https://www.googleapis.com/blogger/v3/users/self/blogs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Blogger data:', error);
    res.status(500).send('Error fetching Blogger data');
  }
});

app.get('/api/blogger/posts', async (req, res) => {
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
});

app.get('/api/blogger/posts/:postId', async (req, res) => {
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
});

app.get('/api/posts', async (req, res) => {
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
});

app.post('/api/create-post', async (req, res) => {
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
});

app.put('/api/edit-post/:postId', async (req, res) => {
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
});

app.delete('/api/delete-post/:postId', async (req, res) => {
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
});


app.get('/api/actionlogs', async (req, res) => {
  try {
    const { blogId,accessToken } = req.query; // Get the blogId from query parameters
    const userId = await fetchGoogleUserId(accessToken);

    // Validate Params
    if (!blogId || !userId) {
      return res.status(400).json({ error: 'Blog ID & UserAccessToken is required' });
    }

    // Fetch action logs for the specific blogId from the database
    const logs = await ActionLog.find({ blogId, userId });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching action logs:', error);
    res.status(500).json({ error: 'Failed to fetch action logs' });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
