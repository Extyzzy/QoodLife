const express = require('express');
const http = require('https');
const fs = require('fs')
const app = express();
const port = 6001;
const server = http.createServer({
  key: fs.readFileSync('/var/www/clients/client0/web4/ssl/socket.qood.life-le.key'),
  cert: fs.readFileSync('/var/www/clients/client0/web4/ssl/socket.qood.life-le.crt')
}, app);
const io = require ('socket.io')(server);
const Redis = require('ioredis');
const	redis = new Redis({
  port: 6379,
  host: 'localhost',
  family: 4,
  password: 'secret',
  db: 0
});

server.listen(port);
redis.psubscribe('*');
app.get('/', (req, res) => res.send('QL sockets port is work !'));

// Push chat messages
redis.on('pmessage', function(pattern, channel, message) {
  message = JSON.parse(message);
  io.emit(channel + ':' + message.event, message.data);
});


// Setup socket.io
io.on('connection', socket => {
  const roomId = socket.handshake.query.roomId;
  console.log(`connected in room: ${roomId}`);

  socket.join(roomId, () => {
    socket.on('client:new-message', data => {
      var selfRoom = roomId.split('.');

      socket.to(`${selfRoom[2]}.chat.${selfRoom[0]}`).emit('server:new-message', data);
      socket.to(`${selfRoom[2]}.chat.${selfRoom[0]}`).emit('server:not-typing');
    });

    socket.on('client:typing', () => {
      var selfRoom = roomId.split('.');
      socket.to(`${selfRoom[2]}.chat.${selfRoom[0]}`).emit('server:typing');
    });

    socket.on('client:not-typing', () => {
      var selfRoom = roomId.split('.');
      socket.to(`${selfRoom[2]}.chat.${selfRoom[0]}`).emit('server:not-typing');
    });

    socket.on('client:new-comment', data => {
      socket.to(roomId).broadcast.emit('server:new-comment', data);
      socket.to(roomId).broadcast.emit('server:comment-not-typing');
    });

    socket.on('client:comment-typing', () => {
      socket.to(roomId).broadcast.emit('server:comment-typing');
    });

    socket.on('client:comment-not-typing', () => {
      socket.to(roomId).broadcast.emit('server:comment-not-typing');
    });
  });

  socket.on('disconnect', () => {
    console.log(`disconnected`);
  });
});
