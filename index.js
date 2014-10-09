/* Added port declaration*/
var port = 5000;
var express = require('express');
var app = express();

/*changed some code to help with listention to server*/
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/* This is the original code
var http = require('http').Server(app);
var io = require('socket.io')(http); */

/* Added port listening */
console.log("Listening on port " + port);
server.listen(port);

/* This is the original code 
app.get('/', function(req, res){
  res.sendfile('index.html'); 
}); */

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Add style sheet 
app.use("/style.css", express.static(__dirname + '/style.css'));

/*This is the original code 
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
}); */

// usernames which are currently connected to the chat
var usernames = {};
 
io.sockets.on('connection', function (socket) {
 
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function (data) {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.emit('updatechat', socket.username, data);
    });
 
    // when the client emits 'adduser', this listens and executes
    socket.on('adduser', function(username){
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        // echo to client they've connected
        socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        // update the list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
    });
 
    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });
});

/* This is the old code

http.listen(3000, function(){
  console.log('listening on *:3000');
});  */