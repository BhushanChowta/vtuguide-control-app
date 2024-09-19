const User = require('../models/User');
const axios = require('axios');

// signInUser (modified to fetch user info from Google)
exports.signInUser = async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Fetch user info from Google using the access token
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userInfo = userInfoResponse.data;
    console.log('userInfo:', userInfo);

    // Check if user exists in your database
    let user = await User.findOne({ googleID: userInfo.sub });

    // If user doesn't exist, create a new user
    if (!user) { 
      user = new User({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        googleID: userInfo.sub,
        accessToken: accessToken,
      });
      await user.save();

      // Respond with the newly created user
      res.json(user); 
    } else {
      // User already exists, send the existing user data
      res.json(user); 
    }
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// getUser 
// exports.getUser = async (req, res) => {
//   const { accessToken } = req.body;

//   try {
//     // Check if user exists in your database
//     let user = await User.findOne({ accessToken: accessToken });
//     // If user doesn't exist, create a new user
//     if (user) { 
//       return res.json(user);  
//     } else {
//       // Handle case where user is not found (maybe send 404)
//       return res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error('Error during user fetch:', error);
//     res.status(500).json({ error: 'Failed to get user' });
//   }
// };