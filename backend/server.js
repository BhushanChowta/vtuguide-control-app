const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const logAction = require('./utils/logAction');
const ActionLog = require('./models/ActionLog'); 
const postRouter = require('./routes/post')
const blogRouter = require('./routes/blog')

require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/api',postRouter.routes);
app.use('/api',blogRouter.routes);

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

const getUserActionLogs =  async (req, res) => {
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
}

//User Action Logs
app.get('/api/actionlogs', getUserActionLogs);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
