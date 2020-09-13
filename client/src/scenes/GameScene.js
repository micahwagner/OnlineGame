import io from "socket.io-client"
import Player from "../js/player/player.js"
import Cell from "../js/Cell.js"

export default class Game extends Phaser.Scene {
	constructor() {
		super({
			key: "Game"
		});
		this.players = {};
		this.map = [];
		this.area = [5, 5];
	}

	preload() {

	}

	create() {
		console.log("bruh")
		this.listenForEvents();
		this.createGroup();
		this.width = this.sys.game.canvas.width;
		this.height = this.sys.game.canvas.height;
		this.mapBounds = [this.width * this.area[0], this.height * this.area[1]];
		this.createMap(this.mapBounds[0] / this.width, this.mapBounds[1] / this.height);
		this.camera = this.cameras.main.centerOn(400, 300);
		this.physics.world.setBounds(0, 0, this.mapBounds[0], this.mapBounds[1]);
		console.log(this.map)
		this.cameraPos = [0, 0];
	}

	update() {

		if (this.mainPlayer) {
			let camMapPos = this.objectMapPos(this.cameraPos[0], this.cameraPos[1]);
			let mainPlayerMapPos = this.objectMapPos(this.mainPlayer.x, this.mainPlayer.y);

			if (mainPlayerMapPos[0] !== camMapPos[0] || mainPlayerMapPos[1] !== camMapPos[1]) {

				this.camera.centerOnX(this.map[mainPlayerMapPos[0]][mainPlayerMapPos[1]].x);
				this.camera.centerOnY(this.map[mainPlayerMapPos[0]][mainPlayerMapPos[1]].y);
				this.cameraPos[0] = this.map[mainPlayerMapPos[0]][mainPlayerMapPos[1]].x;
				this.cameraPos[1] = this.map[mainPlayerMapPos[0]][mainPlayerMapPos[1]].y;

				console.log(this.map[mainPlayerMapPos[0]][mainPlayerMapPos[1]].x);

			}

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
				if (player.playerID === otherPlayer.playerID) {
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

	createMap(w, h) {
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				if (this.map[x] == undefined) {
					this.map[x] = [0];
				} else {
					this.map[x].push(0);
				}
			}
		}

		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				this.map[x][y] = new Cell(this, x, y);
			}
		}
	}


	objectMapPos(x, y) {
		return [Math.floor(x / this.mapBounds[0] * this.map.length), Math.floor(y / this.mapBounds[1] * this.map[0].length)];
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