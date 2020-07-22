// const { generateMessage } = require("../../server/utils/message.js");

var socket = io();

socket.on('connect',()=>{
    console.log('connected to server');
    //socket.emit - run on dev tools on chrome
    // socket.emit('createMessage',generateMessage());
});

socket.on('disconnect',()=>{
    console.log('disconnected from server')
});

socket.on('newMessage',function(message){
    console.log('New message: yes ', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
})

socket.on('newLocationMessage',function(message){
    var li = jQuery('<li></li>');
    li.text(`${message.from}: `);
    var a = jQuery('<a target="_blank">My current location</a>')

    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, ()=>{

    })
})

//setup for location button
var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation){
        alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        alert('Unable to fetch location');
    })
})