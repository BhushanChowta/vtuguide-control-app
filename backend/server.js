const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const postRouter = require('./routes/post')
const blogRouter = require('./routes/blog')
const userActionRouter = require('./routes/userAction')

require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use('/api',postRouter.routes);
app.use('/api',blogRouter.routes);
app.use('/api',userActionRouter.routes);

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
