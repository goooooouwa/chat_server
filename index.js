var fs = require('fs');
var https = require('https');

var privateKey  = fs.readFileSync('/Users/gregxu/.ssl/server.key', 'utf8');
var certificate = fs.readFileSync('/Users/gregxu/.ssl/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = require('express')();
var httpsServer = https.createServer(credentials, app);

var io = require('socket.io').listen(httpsServer);
var redis = require('redis').createClient(6379, 'localhost');

redis.subscribe('data-change');

app.get('/', function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(__dirname + '/index.html');
});

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

httpsServer.listen("https://localhost.ssl:3001", function(){
  console.log('listening on *:3001');
});
