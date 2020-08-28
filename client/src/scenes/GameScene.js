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
		this.player = new Player(this, 100, 100, "player", 0);
	}

	update() {
		this.player.update();
	}

	listenForEvents() {
		this.socket = io("http://localhost:3000");

		this.socket.on("connect", function() {
			console.log("connected");
		});

		this.socket.on('currentPlayers', (players) => {
			console.log(players);
			Object.keys(players).forEach((id) => {
				this.createPlayer();
			});
		});

		this.socket.on("newPlayer", () => {
			this.createPlayer();
			console.log("bruh");
		});
	}

	createPlayer() {
		let player = new Player(this, 0, 0, "player", 0)
		this.otherPlayers.add(player);
	}

	createGroup() {
		this.otherPlayers = this.physics.add.group();
		this.otherPlayers.runChildUpdate = true;
	}
}