const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const message = require('./utils/message');

//creating server
const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

    //message to the new user
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New User Joined'));

    //listener of createMessage
    socket.on('createMessage', (message)=>{
        console.log('server: ', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        //broadcast.emit will not send message to the sender
        // socket.broadcast.emit('newMessage',{
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    //listener for createLocationMessage
    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    })
})


//using express middleware for index.html
app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log(`The server is up on Port ${port}`);
});