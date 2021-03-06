class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }


    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('fighter','./assets/fighter.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('fire', './assets/muzzleflash2.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('fexplosion', './assets/fexplosion.png', {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // set green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);
        // set white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.p1Rocket = new Rocket("P1",this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(2,0);
        this.p2Rocket = new Rocket("P2",this,game.config.width/2,game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0,0);


        // adding spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);
        this.fighter = new Fighter(this, game.config.width + borderUISize * 5, borderUISize * 3,  'fighter', 0, 60).setOrigin(0,0);

        // defining the keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation configs
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.anims.create({
            key: 'fexplode',
            frames: this.anims.generateFrameNumbers('fexplosion', { start: 0, end: 9, first: 0})
        })

        this.particles = this.add.particles('fire');

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(borderUISize * 15.25 + borderPadding, borderUISize + borderPadding * 2, this.p2Score, scoreConfig);
        this.displayClock = this.add.text(borderUISize * 7.625 + borderPadding, borderUISize + borderPadding * 2, game.settings.gameTimer, scoreConfig);
        this.displayBonus = this.add.text(borderUISize * 12 + borderPadding, borderUISize + borderPadding * 2, 'Bonus', scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            if(this.p1Score > this.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Winner P1', scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(game.config.width/2, game.config.height/2 + 128, 'Winner P2', scoreConfig).setOrigin(0.5);
            }
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        if(!this.gameOver){
            this.p1Rocket.update();             // update rocket sprite
            this.p2Rocket.update();             // update p2 rocket sprite
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();        
            this.fighter.update();
        }
        
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket,this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket,this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket,this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.fighter)) {
            this.p1Rocket.reset();
            this.shipExplode(this.p1Rocket,this.fighter);
        }

        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket,this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket,this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket,this.ship01);
        }
        if (this.checkCollision(this.p2Rocket, this.fighter)) {
            this.p2Rocket.reset();
            this.shipExplode(this.p2Rocket,this.fighter);
        }

        var currentTime = game.settings.gameTimer/1000.0 - this.clock.getElapsedSeconds();
        this.displayClock.text = currentTime;
        if(typeof(this.timer) != "undefined") {
            this.displayBonus.text = (this.timer.delay - this.timer.getElapsed())/ 1000.0;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(rocket, ship) {
        // temporarily hide ship
        ship.alpha = 0;
        if (ship.moveSpeed == game.settings.spaceshipSpeed) {
            // create explosion sprite at ship's position
            let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
            boom.anims.play('explode');             // play explosion animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite

            });

            this.particles.createEmitter({
                alpha: { start: 1, end: 0 },
                scale: { start: 0.5, end: 2.5 },
                //tint: { start: 0xff945e, end: 0xff945e },
                speed: 2,
                accelerationY: -60,
                angle: { min: -40, max: -130 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 1000, max: 1100 },
                blendMode: 'ADD',
                frequency: 110,
                maxParticles: 10,
                x: ship.x,
                y: ship.y
            });
        }

        if (ship.moveSpeed == game.settings.fighterSpeed) {
            // create explosion sprite at ship's position
            let boom = this.add.sprite(ship.x, ship.y, 'fexplosion').setOrigin(0,0);
            boom.anims.play('fexplode');             // play explosion animation
            boom.on('animationcomplete', () => {    // callback after anim completes
                ship.reset();                       // reset ship position
                ship.alpha = 1;                     // make ship visible again
                boom.destroy();                     // remove explosion sprite

            });

            this.particles.createEmitter({
                alpha: { start: 1, end: 0 },
                scale: { start: 0.25, end: 1.25 },
                //tint: { start: 0xff945e, end: 0xff945e },
                speed: 2,
                accelerationY: -60,
                angle: { min: -40, max: -130 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 1000, max: 1100 },
                blendMode: 'ADD',
                frequency: 110,
                maxParticles: 10,
                x: ship.x,
                y: ship.y
            });
        }
        
        
        // score add and repaint
        if(rocket.player == "P1"){
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
        }

        if(rocket.player == "P2"){
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
        }
        if(this.clock.paused == false) {
            this.clock.paused = true;
        
            this.timer = this.time.delayedCall(ship.points * 1000.0, () => {
    
                this.clock.paused = false;
            }, null, this);
        } else {
            var remainder = this.timer.delay - this.timer.getElapsed();
            this.timer.remove(false);
            this.timer = this.time.delayedCall(ship.points * 1000.0 + remainder, () => {
    
                this.clock.paused = false;
            }, null, this);
        }
        
        
        
        this.sound.play('sfx_explosion');       // explosion sound effect
    }
}