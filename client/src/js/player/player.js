import * as Phaser from 'phaser';

export default class player extends Phaser.Physics.Arcade.Image {
	constructor(scene, x, y, key, frame, mainPlayer, playerID) {
		super(scene, x, y, key, frame);
		this.scene = scene; // the scene this container will be added to
		this.velocity = 200;
		this.mainPlayer = mainPlayer;
		this.oldPos;
		this.playerID = playerID;

		// enable physics
		this.scene.physics.world.enable(this);
		// set immovable if another object collides with our player
		this.setImmovable(true);
		// scale our player
		this.setScale(4);
		// add the player to our existing scene
		this.scene.add.existing(this);

		this.body.setCollideWorldBounds(true);
	}

	update() {
		this.move();
	}

	move() {
		this.body.setVelocity(0);
		this.cursors = this.scene.input.keyboard.createCursorKeys();

		if (this.mainPlayer) {
			if (this.cursors.left.isDown) {
				this.body.setVelocityX(-this.velocity);
			} else if (this.cursors.right.isDown) {
				this.body.setVelocityX(this.velocity);
			}

			if (this.cursors.up.isDown) {
				this.body.setVelocityY(-this.velocity);
			} else if (this.cursors.down.isDown) {
				this.body.setVelocityY(this.velocity);
			}
		}
	}
}