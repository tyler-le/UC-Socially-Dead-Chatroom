const User = require('../models/user');

// Join user to chat
function userJoin(user) {return user}

// Get current user
async function getCurrentUser(socketid) {
  // User is an array of objects and we only need the first one
  const user = await User.find({id: socketid});
  return user[0];
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room, allUsers) {
  const roomUsers = [];
  for (user in allUsers) {
    if (user.room === room) {
      roomUsers.push(user);
    }
  }
  //array of all our user objects inside the room
  return roomUsers;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};