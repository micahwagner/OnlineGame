

export default class Boot extends Phaser.Scene{
	constructor() {
		super({ key: "Boot"});
	}

	preload(){
		this.load.image("player", "src/assets/playerSprite.png")
	}

	create(){
		this.scene.start("Game")
	}

	update(){

	}
}