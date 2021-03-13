//TODO: Add a delete and edit comment feature
//      Refactor code and move some into utils. For example, addUser(), 
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const History = require('./models/history');
const User = require('./models/user');

const formatMessage = require('./utils/messages');
const showChatHistory = require('./utils/chatHistory');
const {getCurrentUser} = require('./utils/users')

const moment = require('moment');
const socketio = require('socket.io');

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

// Set static folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))

//========== Set up database / Mongoose==========//
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/ucsociallydead'
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.once("open", () => { console.log("Database Connected")});
//=====================================//

const botName = 'Triton Bot';

// Handle client connection.
io.on('connection', socket => {
  socket.on('joinRoom', async ({username, room}) => {
    // Create user & store to database.
    const user = new User({
      username: username,
      room: room,
      id: socket.id
    });
    await user.save();

    socket.join(user.room);
    await showChatHistory(db, formatMessage, socket, user);
   
    const time = moment().clone().subtract(8, 'hours').format('MMMM Do, h:mm A')

    // Emit a welcome message that only the user can see
    socket.emit('message', formatMessage(botName, `Welcome to UC Socially Dead, ${user.username}!`, time));

    if (username !== botName) {
      // Broadcasts to all other users besides client that client has joined the chat.
      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `Say hi to ${username}!`, time));
    }

    io.to(user.room).emit('roomUsers', { room: user.room });
  });

  // Handle chatMessage
  socket.on('chatMessage', async (msg) => {
    const time = moment().clone().subtract(8, 'hours').format('MMMM Do, h:mm A')
    const user = await getCurrentUser(socket.id);

    // Save message to chat history
    if (user.username !== botName) {
      const history = new History({
        sender: user.username,
        message: msg,
        room: user.room,
        time
      })
      await history.save();
    }

    // Emit Message to Chat
    io.to(user.room).emit('message', formatMessage(user.username, msg, time));
  });

  // Handle client disconnect. Delete user from database
  socket.on('disconnect', async () => {
    await User.findOneAndDelete({id: socket.id});
  });
});

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})