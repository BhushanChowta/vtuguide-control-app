const express = require('express');
const routes = express.Router();
const UserController = require('../controllers/UserController');

routes
    // .post('/signup',UserController.signUpUser)
    .post('/login',UserController.signInUser);
    // .get('/',UserController.getUsers)
    // .get('/:id',UserController.getUser)
    // .put('/:id',UserController.replaceUser)
    // .patch('/:id',UserController.updateUser)
    // .delete('/:id',UserController.deleteUser);

exports.routes = routes;