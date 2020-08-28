var express = require('express');
var server = require('http').createServer(express);
var io = require('socket.io')(server);
var PlayerModel = require("../server/PlayerModel.js");

let players = {}

io.on('connection', function(socket) {
	createPlayer(socket);
	console.log(players);

	socket.on('disconnect', function() {
		console.log('user disconnected '+ socket.id);
	});
});

function createPlayer(socket){
	let player = new PlayerModel(socket.id, [0, 0]);
	players[socket.id] = player.pos;
}

// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/index.html');
// });

server.listen(3000, function() {
	console.log(`Listening on ${server.address().port}`);
});