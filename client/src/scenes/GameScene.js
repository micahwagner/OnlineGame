import io from "socket.io-client"
import Player from "../js/player/player.js"

export default class Game extends Phaser.Scene{
	constructor() {
		super({ key: "Game"});
	}

	preload(){

	}

	create(){
		console.log("bruh")
		this.listenForEvents();
		this.cursors = this.input.keyboard.createCursorKeys();
		this.player = new Player(this, 100, 100, "player", 0);
	}

	update(){
		this.player.update(this.cursors);
	}

	listenForEvents() {
		this.socket = io("http://localhost:3000");

		this.socket.on("connect", function(){
			console.log("connected");
		}) 
	}
}