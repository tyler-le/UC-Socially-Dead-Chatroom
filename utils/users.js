const User = require('../models/user');

// Get current user
async function getCurrentUser(socketid) {
  // user is an array of a single object. The 0th element of this array corresponds to our current user
  const user = await User.find({id: socketid});
  return user[0];
}

module.exports = {getCurrentUser};