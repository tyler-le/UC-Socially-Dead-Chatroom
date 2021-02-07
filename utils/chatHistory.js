const moment = require('moment');


async function showChatHistory(db, formatMessage, io, user) {
  const timeBreak = moment().format("MMMM Do"); // "Sunday, February 14th 2010, 3:25:50 pm"
  // Load the database
  const chatHistoryArray = await db.collection('histories').find({}).toArray();

  for (chat of chatHistoryArray) {
    // Emit chat message
      if(chat.room === user.room){
        io.to(user.room).emit('message', formatMessage(chat.sender, chat.message, chat.time))
      }
  }
}

module.exports = showChatHistory;