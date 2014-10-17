/* Added port declaration*/
var port = 5000;
var express = require('express');
var app = express();

/*changed some code to help with listention to server*/
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/* Adding in Redis functionality */
var redis = require('redis');
var client = redis.createClient();

/* Added port listening */
console.log("Listening on port " + port);
server.listen(port);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Add style sheet 
app.use("/style.css", express.static(__dirname + '/style.css'));

/* Adding in message store */
var storeMessage = function(name,data){
    var message = JSON.stringify({name: name, data: data});
    redisClient.lpush("messages", message, function (err,response){
        redisClient.ltrim("messages", 0, 10);
    });
}
/* Function to for joining chat */
client.on('join', function(name){
    redisClient.lrange("messages", 0,-1, function (err, message){
        messages=messages.reverse();
        messages.forEach(function(message){
            message=JSON.parse(message);
            client.emit("messages", message.name+": " + message.data);
        });
    });
});
/* Adding new member to "Chatters" set */
client.on('join', function(name){
    client.broadcast.emit("add chatter", name);
    redisClient.sadd("chatters", name);
});

client.on('join', function(name){
    client.broadcast.emit("add chatter", name);
    redisClient.smembers('names', function (err, names){
        names.forEach(function(name){
            client.emit('add chatter', name);
    });
});
/* Adding chatter*/

   redisClient.sadd("chatters", name); 
});
/* Removing chatters */
client.on('disconnect', function(name){
    client.get('nickname', function (err, name){
        client.broadcast.emit("remove chatter", name);
        redisClient.srem("chatters", name);
    });
});
/* old code, that works! 
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
}); */