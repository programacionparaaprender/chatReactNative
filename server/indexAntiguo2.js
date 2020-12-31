var express=require('express');
var socket=require('socket.io');

var app=express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});


var server=app.listen(3000,function(){
    console.log('3000 port dinleniyor');
    
})




app.use(express.static('public'));

var io=socket(server);

io.on('connection',function(socket){
    console.log('socket baglantısı yapıldı.',socket.id);

    socket.on('chat', function(data){
        console.log('data backend: '+data);
        io.sockets.emit('chat', data);
    });

    
    socket.on('yaziyor', function(data){
        socket.broadcast.emit('yaziyor', data);
    });

})