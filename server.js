//TODO: Add a delete and edit comment feature
const History = require('./models/history');
const formatMessage = require('./utils/messages');
const showChatHistory = require('./utils/chatHistory');

const moment = require('moment');
require('dotenv').config();
const socketio = require('socket.io');

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

const User = require('./models/user');
const {
  userJoin,
  getCurrentUser,
} = require('./utils/users')

// Set static folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')))

// Setup EJS
app.set('view engine', 'ejs');

//========== Set up database / Mongoose==========//\
const dbUrl = process.env.DB_URL
const mongoose = require('mongoose');
// Atlas DB
// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected");
})
//=====================================//

const botName = 'Triton Bot'
// Run when a client connects. Store user to database
io.on('connection', socket => {
   socket.on('joinRoom', async ({username, room}) => {

    const user = new User({
      username: username,
      room: room,
      id: socket.id
    });

    await user.save();
    await db.collection('users').find({}).toArray().then((allUsers) => {
      userJoin(user);
      socket.join(user.room);
    });

    // //Show Chat History
    await showChatHistory(db, formatMessage, socket, user);

    // Then welcome incoming user
    const time = moment().format('MMMM Do, h:mm A');
    socket.emit('message', formatMessage(botName, `Welcome to UC Socially Dead, ${user.username}!`, time));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `Say hi to ${username}!`, time));

    // Get all users from db
    db.collection('users').find({}).toArray().then((allUsers) => {
      // Send users and room info
      io.to(user.room).emit('roomUsers', {room: user.room,allUsers});
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    getCurrentUser(socket.id).then(async user => {
      const time = moment().format('MMMM Do, h:mm A');

       // Add message to history
     const history = new History({
      sender: user.username,
      message: msg,
      room: user.room,
      time: time
    })
    await history.save();
      // Emit Message
      io.to(user.room).emit('message', formatMessage(user.username, msg, time));
    });
  })

  // Runs when client disconnects. Remove user from database
  socket.on('disconnect', async () => {
    // Emit Message
    const user = await User.find({id: socket.id});
    if (user) {
      const time = moment().format('h:mm a');
      io.to(user[0].room).emit('message', formatMessage(botName, `${user[0].username} has left the chat`, time));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})