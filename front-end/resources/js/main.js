const socket = io('http://localhost:3000');
const list = document.getElementById('list');
// écoute du socket
socket.on('message', function (msg) {
  console.log('Received', msg);
  let li = document.createElement('li');
  li.textContent = msg;
  list.appendChild(li);
});

let selectRoom = document.getElementById('room-select');
let form = document.getElementById('broadcast-section');
let input = document.getElementById('input');
let selectedRoom = '';
let hand = document.getElementById('hand');

let handStack = []
/*
ROOM SELECTION
*/
selectRoom.addEventListener('change', (e) => {
  let room = e.target.value;
  socket.emit('join', selectedRoom, room);
  selectedRoom = room;
  let select = document.getElementById('levelSelect');
  let chat = document.getElementById('game');
  let leveldis = document.getElementById('levelDisplay');
  select.style.display = 'none';
  chat.style.display = 'block';
  leveldis.append(room);
  
  //@ToDo format code
  //document.getElementById(<id de l'element>).style.fontWeight = "bold";
  list.innerHTML = '';
})

socket.on("stack", (stack) =>{
  console.log(stack)
})

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let data = document.forms['broadcast-form'];

  socket.emit('message', {
    room: selectedRoom,
    message: data['message'].value
  });
});



function fillHand(){
  handStack = stack.splice(0, 5);
  console.log(handStack)
}