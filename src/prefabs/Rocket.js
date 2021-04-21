// Rocket prefab definition
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(player,scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.player = player;

        // adding object to existing scene
        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        if(this.player == "P1") {
            // setting up left/right movement
            if(!this.isFiring) {
                if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
                    this.x -= this.moveSpeed;
                } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                    this.x += this.moveSpeed;
                }
            }
            // setting up the fire button
            if(Phaser.Input.Keyboard.JustDown(keyUP) && !this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play();  // play sfx
            }
        }

        if(this.player == "P2") {
            // setting up left/right movement
            if(!this.isFiring) {
                if(keyA.isDown && this.x >= borderUISize + this.width) {
                    this.x -= this.moveSpeed;
                } else if (keyD.isDown && this.x <= game.config.width - borderUISize - this.width) {
                    this.x += this.moveSpeed;
                }
            }
            // setting up the fire button
            if(Phaser.Input.Keyboard.JustDown(keyW) && !this.isFiring) {
                this.isFiring = true;
                this.sfxRocket.play();  // play sfx
            }
        }
        
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.isFiring = false;
            this.y = game.config.height - borderUISize - borderPadding;
        }
    }

    // resetting the rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}