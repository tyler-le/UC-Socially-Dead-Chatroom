
async function showChatHistory(db, io, formatMessage){
    // Load the database
    const chatHistoryArray = await db.collection('histories').find({}).toArray();

    // Loop through array and emit message 
    for (chat of chatHistoryArray){
      // Emit chat message
      io.to(chat.room).emit('message', formatMessage(chat.sender, chat.message, chat.time));
    }
  }

  module.exports = showChatHistory;