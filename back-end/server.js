const http = require('http');
const app = require('./app');
const Card = require('./models/card')

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"]
  }
})

var rooms = io.sockets.adapter.rooms
let stacks = []
let colors = ["blue", "yellow", "red", "green"]

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  //console.log('Listening on ' + bind);
});

// Établissement de la connexion à Socket.io
io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    //console.log(`user ${socket.id} disconnected`);
    //io.emit('message', `Bye ${socket.id}`);
  });

  console.log(`Connecté au client ${socket.id}`);



  socket.on('join', (prev, room) => {

    let hasStack = stacks.filter((value, index, array) => {
      return value.room == room;
    })
    socket.join(room);
    console.log(hasStack)

    if(hasStack.length == 0){
      let stack = fillStack();
      stack = shuffleArray(stack);
      let roomStack = {
        stack: stack,
        room: room
      }
      stacks.push(roomStack);
      socket.emit("stack", roomStack);
    }else{
      socket.emit("stack", hasStack);
    }
    
  });

  socket.on('message', (msg) => {
    // On envoie un message à la room sélectionnée
    console.log('room:', msg.room);
    console.log('message:', msg.message);
    io.in(msg.room).emit('message', msg.message);
  });

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });

  io.of("/").adapter.on("join-room", (room, id) => {
    //console.log(`socket ${id} has joined room ${room}`);
  });
})

function fillStack() {
  let stack = [];
  for (i = 0; i < 10; ++i) {
    for (j = 0; j < 4; ++j) {
      let card = new Card(i, colors[j])
      stack.push(card)
      stack.push(card)
    }
  }
  return stack;
}

function shuffleArray(stack) {
  for (let i = stack.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stack[i], stack[j]] = [stack[j], stack[i]];
  }
  return stack;
}

server.listen(port);
