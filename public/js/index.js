var socket = io();

socket.on('connect',()=>{
    console.log('connected to server');

    socket.emit('createMessage',{
        from: 'abc@gmail.com',
        text: 'Anything'
    });
});

socket.on('disconnect',()=>{
    console.log('disconnected from server')
});

socket.on('newMessage',function(message){
    console.log('New message: ', message);
})