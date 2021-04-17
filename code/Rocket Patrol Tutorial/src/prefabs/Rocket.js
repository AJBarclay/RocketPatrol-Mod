// Rocket prefab definition
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // adding object to existing scene
        scene.add.existing(this);
    }
}