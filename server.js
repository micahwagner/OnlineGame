var express = require('express');
var server = require('http').createServer(express);
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log('a user connected ' + socket.id);

	socket.on('disconnect', function() {
		console.log('user disconnected '+ socket.id);
	});
});

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/index.html');
// });

server.listen(3000, function() {
	console.log(`Listening on ${server.address().port}`);
});