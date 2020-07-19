const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('New user connected');

    socket.emit('newMessage',{
        from: 'Vivek',
        message: "Hi",
        createdAt: 123
    })

    socket.on('createmessage', (newEmail)=>{
        console.log(message);
    })

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    })
})



app.use(express.static(publicPath));

server.listen(port, ()=>{
    console.log('The server is up on Port 3000');
});