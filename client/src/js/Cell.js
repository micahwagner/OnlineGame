export default class Cell {
	constructor(scene, x, y){
		this.scene = scene;
		this.x = Math.floor((x / this.scene.map[0].length * this.scene.mapBounds[1]) + Math.floor(this.scene.mapBounds[1] / this.scene.map.length / 2));
		this.y = Math.floor((y / this.scene.map.length * this.scene.mapBounds[0]) + Math.floor(this.scene.mapBounds[0] / this.scene.map[0].length / 2));
		this.objects = [];
	}
}