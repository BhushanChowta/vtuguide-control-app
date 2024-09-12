const axios = require('axios');
const { google } = require('googleapis');
const blogger = google.blogger('v3');
const logAction = require('../utils/logAction');
const ActionLog = require('../models/ActionLog'); 
const User = require('../models/User'); 


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
    const user = await User.findOne({ accessToken: accessToken }); 

    if (!user) {
      throw new Error('User not found'); 
    }

    return user.googleID; // Return the user's ID from your database
  } catch (error) {
    console.error('Error fetching user from database:', error);
    throw error; 
  }
};
