const moment = require('moment');

async function showChatHistory(db, formatMessage, socket, user) {
  // const timeBreak = moment().format("MMMM Do"); // "Sunday, February 14th 2010, 3:25:50 pm"
  // Load the database
  const chatHistoryArray = await db.collection('histories').find({}).toArray();

  // for (chat of chatHistoryArray) {
  //   // Emit chat message
  //     if(chat.room === user.room){
  //       socket.emit('message', formatMessage(chat.sender, chat.message, chat.time))
  //     }
  // }

  if (user.room !== 'Social') {
    for (chat of chatHistoryArray){
      if (chat.room === user.room) {
        socket.emit('message', formatMessage(chat.sender, chat.message, chat.time))
      }
    }

  } else {
    for (let i = chatHistoryArray.length - 1; i > chatHistoryArray.length - 500; i--) {
      let chat = chatHistoryArray[i]
      if (chat.room === user.room) {
        socket.emit('message', formatMessage(chat.sender, chat.message, chat.time))
      }
    }
  }

  // socket.emit('timeBreak', formatMessage("", " ", timeBreak))
}

module.exports = showChatHistory;