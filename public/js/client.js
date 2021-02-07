const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room query string
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const socket = io();
//Join Chatroom
socket.emit('joinRoom', {
  username,
  room
})

// Get room and users
socket.on('roomUsers', ({room,allUsers}) => {
  outputRoomName(room);
  // outputUsers(allUsers, room)
});

//Message from server
socket.on('message', message => {  
  outputMessage(message)

  //Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// //Time break for chat history from server
// socket.on('timeBreak', message => {  
//   dateBreak(message)

//   //Scroll Down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

//Message Submit
chatForm.addEventListener('submit', (e) => {
  //Prevent refresh for form submission
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  //Clear input box
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

})

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class='meta'> ${message.username} <span>${message.time} </span></p> <p class = "text" > ${message.text} </p>`
  document.querySelector('.chat-messages').appendChild(div);
}

// function dateBreak(message){

//   const div = document.createElement('div');
//   // div.classList.add('message');
//   div.innerHTML = `<h5 class = 'dateBreak'> <span class = 'dateText'>${message.time}</span> </h5>`
//   document.querySelector('.chat-messages').appendChild(div);

// }

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
//Outputs unique names but doesn't delete users who have left
// function outputUsers(allUsers, room) {
//   const usersInRoom = [];
//   userList.innerHTML = '';
//   let uniqueNames = [];

//   for (user of allUsers) {
//     //Find all user objects that belong to specific room
//     if (user.room === room) {
//       usersInRoom.push(user)
//     }
//   }
//   const arr = usersInRoom, unique = [...new Set(arr.map(a => a.username))];
//   uniqueNames = [...unique];
//   // Output unique names to DOM
//   console.log(uniqueNames)
//   for (uniqueNames of unique) {
//     const li = document.createElement('li');
//     li.innerText = uniqueNames;
//     userList.appendChild(li);
//   }
// }


// // Add users to DOM. Outputs names correctly but has weird bug that duplicates when refreshing
// function outputUsers(allUsers, room) {
//   userList.innerHTML = '';

//   for (user of allUsers) {
//     //Find all user objects that belong to specific room
//     if (user.room === room) {
//       const li = document.createElement('li');
//       li.innerText = user.username;
//       userList.appendChild(li);
//     }
//   }
// }
