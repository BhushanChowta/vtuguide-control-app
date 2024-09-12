const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleID: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
});

const user = mongoose.model('user', userSchema);

module.exports = user;