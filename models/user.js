const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String, 
    room: String,
    id: String
})

module.exports = mongoose.model('User', UserSchema);