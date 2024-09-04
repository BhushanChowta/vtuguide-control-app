const express = require('express');
const BlogController = require('../controllers/BlogController')
const routes = express.Router();

//C R U D POSTS
routes
.post('/blogger',BlogController.getBlogs);

exports.routes=routes;