const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

//local files
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isStringValid } = require('./utils/validation');
const message = require('./utils/message');
const {Users} = require('./utils/users');

//creating server
const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.on('join', (param, callback)=>{
        if(!isStringValid(param.name) || !isStringValid(param.room)){
           return  callback('Incorrect name or room');
        }
        socket.join(param.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, param.name, param.room);

        io.to(param.room).emit('updateUserList', users.getUsersList(param.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));
        //message to the new user
        //displaying message only to room members
        socket.broadcast.to(param.room).emit('newMessage',generateMessage('Admin', `${param.name} has joined`));

        callback();
    })

    //listener of createMessage
    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);

        if(user && isStringValid(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
        //broadcast.emit will not send message to the sender
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    //listener for createLocationMessage
    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
        // callback();
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected');
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    })
})


//using express middleware for index.html
app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(`The server is up on Port ${port}`);
});