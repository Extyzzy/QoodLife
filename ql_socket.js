var io = require ('socket.io')(6001),
	Redis = require('ioredis'),
	redis = new Redis();

redis.psubscribe('*');

redis.on('pmessage', (pattern, channel, message) => {
  message = JSON.parse(message);
  io.emit(channel + ':' + message.event, message.data);
	console.log(message)
});
