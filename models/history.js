const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    sender: String,
    message: String, 
    room: String,
    time: String
})

module.exports = mongoose.model('history', historySchema);