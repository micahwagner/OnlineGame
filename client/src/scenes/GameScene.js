import io from "socket.io-client"
import Player from "../js/player/player.js"

export default class Game extends Phaser.Scene {
	constructor() {
		super({
			key: "Game"
		});
		this.players = {};
	}

	preload() {

	}

	create() {
		console.log("bruh")
		this.listenForEvents();
		this.createGroup();
	}

	update() {

		if (this.mainPlayer) {
			this.mainPlayer.update();
			let playerCords = {
				x: this.mainPlayer.x,
				y: this.mainPlayer.y
			};
			if (this.mainPlayer.oldPos) {
				if (playerCords.x !== this.mainPlayer.oldPos.x ||
					playerCords.y !== this.mainPlayer.oldPos.y) {
					this.socket.emit("playerMoved", playerCords);
				}
			}
			this.mainPlayer.oldPos = playerCords;
		}
	}

	listenForEvents() {
		this.socket = io("http://localhost:3000");

		this.socket.emit("playerJoined");

		this.socket.on("connect", function() {
			console.log("connected");
		});

		this.socket.on('movePlayer', (player) => {
			this.otherPlayers.getChildren().forEach((otherPlayer) => {
				console.log(otherPlayer.playerID);
				if (player.playerID === otherPlayer.playerID) {
					console.log(player);
					otherPlayer.x = player.pos[0];
					otherPlayer.y = player.pos[1];
				}
			});
		});

		this.socket.on('currentPlayers', (players) => {
			Object.keys(players).forEach((id) => {
				if (players[id].playerID === this.socket.id) {
					this.createPlayer(players[id], true);
				} else {
					this.createPlayer(players[id], false);
				}
			});
		});

		this.socket.on("newPlayer", (player) => {
			this.createPlayer(player, false);
		});
	}

	createPlayer(newPlayer, mainPlayer) {
		console.log(newPlayer);
		let player = new Player(
			this,
		 	newPlayer.pos[0], 
		 	newPlayer.pos[1], 
		 	"player", 
		 	0, 
		 	mainPlayer, 
		 	newPlayer.playerID
		 );
		if (!mainPlayer) {
			this.otherPlayers.add(player);
		} else {
			this.mainPlayer = player;
		}

	}

	createGroup() {
		this.otherPlayers = this.physics.add.group();
		this.otherPlayers.runChildUpdate = true;
	}
}