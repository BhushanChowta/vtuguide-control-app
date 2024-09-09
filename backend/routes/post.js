const express = require('express');
const PostController = require('../controllers/PostController')
const routes = express.Router();

//C R U D POSTS
routes
.get('/posts',PostController.getPosts)
.get('/posts/:postId',PostController.getPost)
.post('/create-post',PostController.createPost)
.put('/edit-post/:postId',PostController.editPost)
.delete('/delete-post/:postId',PostController.deletePost)
.post('/contribute-post',PostController.contributePost)
.get('/postSubmissions',PostController.postSubmissions);

exports.routes=routes;