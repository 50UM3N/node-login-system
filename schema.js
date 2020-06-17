const mongoose = require('mongoose');
const user = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    comment: [{
        type: String
    }]
});
module.exports = new mongoose.model('user', user);