var io = require('socket.io')(process.env.PORT);
var redis = require('redis').createClient(process.env.REDIS_URL);

redis.subscribe('data-change');

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  redis.on('message', function(channel, message){
    socket.emit('rt-change', message);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
