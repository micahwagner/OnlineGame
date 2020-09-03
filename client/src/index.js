import Phaser from "phaser";
import Game from "./scenes/GameScene.js"
import Boot from "./scenes/BootScene.js"

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [Boot, Game],
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: {
				y: 0,
			},
		},
	},
	pixelArt: true,
	roundPixels: true,

};

const game = new Phaser.Game(config);