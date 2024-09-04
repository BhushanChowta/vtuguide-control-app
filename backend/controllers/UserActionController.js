const axios = require('axios');
const { google } = require('googleapis');
const blogger = google.blogger('v3');
const logAction = require('../utils/logAction');
const ActionLog = require('../models/ActionLog'); 


exports.getUserActionLogs =  async (req, res) => {
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
