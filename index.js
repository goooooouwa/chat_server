var http = require('http').Server();
var io = require('socket.io')(http);
var redis = require('redis').createClient(6379, 'localhost');

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

http.listen(3001, function(){
  console.log('listening on *:3001');
});
