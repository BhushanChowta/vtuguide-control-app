const express = require('express');
const UserActionController = require('../controllers/UserActionController')
const routes = express.Router();

//User Action Logs
routes
.get('/actionlogs', UserActionController.getUserActionLogs);

exports.routes=routes;