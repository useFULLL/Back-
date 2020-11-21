var socket = io();

socket.on('send',function(data){
    console.log(data);
});