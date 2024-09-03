const express = require('express');
const PostController = require('../controllers/PostController')
const routes = express.Router();

//C R U D POSTS
routes
.get('/posts',PostController.getPosts)
.post('/create-post',PostController.createPost)
.put('/edit-post/:postId',PostController.editPost)
.delete('/delete-post/:postId',PostController.deletePost);

exports.routes=routes;