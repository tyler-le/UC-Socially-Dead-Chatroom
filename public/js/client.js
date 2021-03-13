const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room query string
const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const socket = io();

//Join Chatroom
socket.emit('joinRoom', {username, room})

// Get room and users
socket.on('roomUsers', ({room}) => {outputRoomName(room)});

//Message from server
socket.on('message', message => {  
  outputMessage(message)

  //Scrolls down when a new message is sent
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


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

    const pInfo = document.createElement('p');
    pInfo.classList.add('meta');
    const pText = document.createElement('p');
    pText.classList.add('text');

    pInfo.innerText = `${message.username} `
    const spanTime = document.createElement('span');
    const spanMessage = document.createElement('span');

    spanTime.innerText = message.time;
    spanMessage.innerText = message.text

    pInfo.appendChild(spanTime);
    pText.appendChild(spanMessage);

    div.appendChild(pInfo);
    div.appendChild(pText);

    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
