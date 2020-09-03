var express = require('express');
var server = require('http').createServer(express);
var io = require('socket.io')(server);
var PlayerModel = require("../server/PlayerModel.js");

let players = {}

io.on('connection', function(socket) {
	socket.on("playerJoined", () => {
		createPlayer(socket);
	})
	console.log(players);

	socket.on("playerMoved", (playerData) => {
		console.log(playerData);
		players[socket.id].pos[0] = playerData.x;
		players[socket.id].pos[1] = playerData.y;

		io.emit("movePlayer", players[socket.id]); 
	});

	socket.on('disconnect', function() {
		deletePlayer(socket);
		console.log('user disconnected '+ socket.id);
	});
});

function createPlayer(socket){
	let player = new PlayerModel(socket.id, [0, 0]);
	players[socket.id] = player;
	socket.emit("currentPlayers", players);
	socket.broadcast.emit("newPlayer", players[socket.id]);
}

function deletePlayer(socket){
	delete players[socket.id]; 
}
// app.use(express.static(__dirname + '/public'));

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/index.html');
// });

server.listen(3000, function() {
	console.log(`Listening on ${server.address().port}`);
});