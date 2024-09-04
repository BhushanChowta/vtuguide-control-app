const axios = require('axios');
const { google } = require('googleapis');
const blogger = google.blogger('v3');
const logAction = require('../utils/logAction');


exports.getBlogs = async (req, res) => {
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
}
