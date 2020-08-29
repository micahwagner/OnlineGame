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
		if(this.mainPlayer) this.mainPlayer.update();
	}

	listenForEvents() {
		this.socket = io("http://localhost:3000");

		this.socket.on("connect", function() {
			console.log("connected");
		});

		this.socket.on('currentPlayers', (players) => {
			Object.keys(players).forEach((id) => {
				console.log(players);
				if (players[id].playerID === this.socket.id) {
					this.createPlayer(true);
				} else {
					this.createPlayer(false);
				}
			});
		});

		this.socket.on("newPlayer", () => {
			this.createPlayer(false);
		});
	}

	createPlayer(mainPlayer) {
		let player = new Player(this, 0, 0, "player", 0, mainPlayer);
		console.log(player);
		if(!mainPlayer){
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