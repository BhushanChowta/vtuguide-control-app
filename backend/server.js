const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
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
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/create-post', async (req, res) => {
    const { title, content } = req.body;

    try {
        const blogger = google.blogger({
            version: 'v3',
            auth: oauth2Client,
        });

        const response = await blogger.posts.insert({
            blogId: process.env.BLOG_ID,
            requestBody: {
                title: title,
                content: content,
            },
            isDraft: true, // Set the post to be a draft
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/api/edit-post/:postId', async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
        const blogger = google.blogger({
            version: 'v3',
            auth: oauth2Client,
        });

        const response = await blogger.posts.update({
            blogId: process.env.BLOG_ID,
            postId: postId,
            requestBody: {
                title: title,
                content: content,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/delete-post/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        const blogger = google.blogger({
            version: 'v3',
            auth: oauth2Client,
        });

        await blogger.posts.delete({
            blogId: process.env.BLOG_ID,
            postId: postId,
        });

        res.status(200).json({ message: `${postId} Post deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
