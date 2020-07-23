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
    // console.log('New message: yes ', message);

    //way to use mustache
    // time format HH:MM AM/PM
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);

    //time format HH:MM AM/PM
    // var formattedTime = moment(message.createdAt).format('h:mm a')
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
})

socket.on('newLocationMessage',function(message){

    //using mustaches
    //time as HH:MM AM/PM
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);



    //alternative method 
    // var li = jQuery('<li></li>');
    // var formattedTime = moment(message.createdAt).format('h:mm a')
    // li.text(`${message.from} ${formattedTime}: `);
    // var a = jQuery('<a target="_blank">My current location</a>')

    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, () =>{
        messageTextbox.val('');
    })
    messageTextbox.val('');
})

//setup for location button
var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation){
        alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position){
        
        locationButton.removeAttr('disabled').text('Send location');    
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    })
})