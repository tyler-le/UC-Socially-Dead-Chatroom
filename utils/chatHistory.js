
async function showChatHistory(db, formatMessage, socket, user) {
  const chatHistoryArray = await db.collection('histories').find({room:user.room}).toArray();

  for (chat of chatHistoryArray) {
      socket.emit('message', formatMessage(chat.sender, chat.message, chat.time))
  }
}

module.exports = showChatHistory;