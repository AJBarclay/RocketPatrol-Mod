// Alexander Barclay, Rocket Patrol Mod, 4/21/2021, project duration: 16 hours
// MODIFICATIONS:
// Simultaneous Multiplayer 30pts
// Bonus Time Score Mechanic 20pts
// Fighter SpaceShip type (Faster,Smaller,More points) 20pts
// Particle Emission on Shipexplode 20pts
// Display Time Remaining 10pts
// Total: 30 + 20 + 20 + 20 + 10 = 100

// Credits
// Particle emitter example followed from: https://phaser.io/examples/v3/view/game-objects/particle-emitter/fire-max-10-particles
// Particle image resized from: https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/particles/muzzleflash2.png
// Advice on adding parameter to Rocket to make use of in distinguishing p1 from p2 in making simultaneous multiplayer from Ethan Jung, teammate, verbal description of strategy over Discord
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

// reserving the keyboard vars
let keyA, keyD, keyW, keyUP, keyR, keyLEFT, keyRIGHT;

//setting the UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;