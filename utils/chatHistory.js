
async function showChatHistory(db, formatMessage, socket, user) {
  const chatHistoryArray = await db.collection('histories').find({}).toArray();

  for (chat of chatHistoryArray) {
      if(chat.room === user.room){
        socket.emit('message', formatMessage(chat.sender, chat.message, chat.time))
      }
  }
}

module.exports = showChatHistory;