
async function showChatHistory(db, io, formatMessage, socket){
    // Load the database
    const chatHistoryArray = await db.collection('histories').find({}).toArray();

    // Loop through array and emit message 
    for (chat of chatHistoryArray){
      // Emit chat message
      socket.emit('message', formatMessage(chat.sender, chat.message, chat.time));
    }
  }

  module.exports = showChatHistory;