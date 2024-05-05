// Configuration for the Phaser game
var config = {
    width: 320,
    height: 505,
    type: Phaser.AUTO,
    parent: "game",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1150 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Preload assets
function preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("title", "assets/title.png");
    this.load.spritesheet("bird", "assets/bird.png", 34, 24, 3);
    this.load.image("btn", "assets/start-button.png");
    this.load.spritesheet("pipe", "assets/pipes.png", 54, 320, 2);
    this.load.bitmapFont("flappy_font", "assets/fonts/flappyfont/flappyfont.png", "assets/fonts/flappyfont/flappyfont.fnt");
    this.load.audio("fly_sound", "assets/flap.wav");
    this.load.audio("score_sound", "assets/score.wav");
    this.load.audio("hit_pipe_sound", "assets/pipe-hit.wav");
    this.load.audio("hit_ground_sound", "assets/ouch.wav");
    this.load.image("ready_text", "assets/get-ready.png");
    this.load.image("play_tip", "assets/instructions.png");
    this.load.image("game_over", "assets/gameover.png");
    this.load.image("score_board", "assets/scoreboard.png");

    // Add a loading sprite and set it as the preload sprite
    var loading = this.add.sprite(35, this.game.config.height / 2, "loading");
    this.load.setPreloadSprite(loading);

    // Handle errors when loading assets
    this.load.on("fileerror", function(file) {
        console.error("Error loading file: " + file.key);
    });
}

// Create game objects
function create() {
    // Add the background and set it to scroll horizontally
    this.bg = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, "background").setScrollFactor(1, 0);

    // Add the ground and set it to scroll horizontally
    this.ground = this.add.tileSprite(0, this.game.config.height - 112, this.game.config.width, 112, "ground").setScrollFactor(1, 0);

    // Add the title image
    var title = this.add.image(35, 10, "title");

    // Add the bird sprite and set its animations
    this.bird = this.add.sprite(50, 150, "bird");
    this.bird.animations.add("fly", [0, 1, 2], 12, true);
    this.bird.animations.play("fly");

    // Enable physics for the bird and set its gravity
    this.physics.enable(this.bird, Phaser.Physics.Arcade);
    this.bird.body.gravity.y = 0;

    // Add the start button and handle its click event
    var btn = this.add.button(this.game.config.width / 2, this.game.config.height / 2, "btn", startGame, this);
    btn.anchor.setTo(0.5, 0.5);

    // Add the ready text and play tip images
    var readyText = this.add.image(this.game.config.width / 2, 40, "ready_text");
    var playTip = this.add.image(this.game.config.width / 2, 300, "play_tip");
    readyText.anchor.setTo(0.5, 0);
    playTip.anchor.setTo(0.5, 0);

    // Add the game over text and score board images
    var gameOver = this.add.image(this.game.config.width / 2, 0, "game_over");
    var scoreBoard = this.add.image(this.game.config.width / 2, 70, "score_board");
    gameOver.anchor.setTo(0.5, 0);
    scoreBoard.anchor.setTo(0.5, 0);

    // Add the score text and set its font
    this.scoreText = this.add.bitmapText(this.game.config.width / 2 - 20, 30, "flappy_font", "0", 36);

    // Add the fly sound and score sound
    this.soundFly = this.sound.add("fly_sound");
    this.soundScore = this.sound.add("score_sound");

    // Add the hit pipe sound and hit ground sound
    this.soundHitPipe = this.sound.add("hit_pipe_sound");
    this.soundHitGround = this.sound.add("hit_ground_sound");

    // Initialize the game variables
    this.gameSpeed = 200;
    this.gameIsOver = false;
    this.hasHitGround = false;
    this.hasStarted = false;
    this.score = 0;
    this.bestScore = 0;
    this.pipeGroup = this.physics.add.group();
    this.gameOverGroup = this.add.group();

    // Start the game loop
    this.time.addEvent({ delay: 900, callback: generatePipes, callbackScope: this, loop: true });
}

// Update game objects
function update() {
    if (this.hasStarted) {
        // Check for collisions with the ground
        this.physics.arcade.collide(this.bird, this.ground, hitGround, null, this);

        // Check for collisions with the pipes
        this.physics.arcade.overlap(this.bird, this.pipeGroup, hitPipe, null, this);

        // Rotate the bird when it's falling
        if (this.bird.angle < 90) {
            this.bird.angle += 2.5;
        }

        // Check for scores when the bird passes a pipe
        this.pipeGroup.getChildren().forEach(checkScore, this);
    }
}

// Start the game
function startGame() {
    this.gameSpeed = 200;
    this.gameIsOver = false;
    this.hasHitGround = false;
    this.hasStarted = true;
    this.score = 0;
    this.bg.setScrollFactor(1, -(this.gameSpeed / 10));
    this.ground.setScrollFactor(1, -this.gameSpeed);
    this.bird.body.gravity.y = 1150;
    this.readyText.destroy();
    this.playTip.destroy();
    this.input.on("pointerdown", fly, this);
    this.time.addEvent(1);
}

// Stop the game
function stopGame() {
    this.bg.setScrollFactor(0, 0);
    this.ground.setScrollFactor(0, 0);
    this.pipeGroup.getChildren().forEach(function(pipe) {
        pipe.setAccelerationX(0);
    }, this);
    this.bird.animations.stop("fly", 0);
    this.input.off("pointerdown", fly, this);
    this.time.addEvent(0);
}

// Make the bird fly
function fly() {
    this.bird.body.velocity.y = -350;
    this.bird.setAccelerationX(0);
    this.bird.setAccelerationY(0);
    this.bird.setAngularAcceleration(0);
    this.bird.setAngularVelocity(0);
    this.bird.setDragX(0);
    this.bird.setDragY(0);
    this.bird.setBounce(0);
    this.bird.setMaxVelocity(1000, 1000);
    this.bird.setMass(1);
    this.bird.setSize(16, 16, true);
    this.bird.setOffset(0, 0);
    this.bird.setOrigin(0.5, 0.5);
    this.bird.setRotation(0);
    this.bird.setActive(true);
    this.bird.setVisible(true);
    this.bird.setDepth(1);
    this.bird.setAngularVelocity(-200);
    this.bird.setAccelerationX(0);
    this.bird.setAccelerationY(1000);
    this.bird.setDragX(0);
    this.bird.setDragY(0);
    this.bird.setBounce(0);
    this.bird.setMaxVelocity(1000, 1000);
    this.bird.setMass(1);
    this.bird.setSize(16, 16, true);
    this.bird.setOffset(0, 0);
    this.bird.setOrigin(0.5, 0.5);
    this.bird.setDepth(1);
    this.bird.setAlpha(1);
    this.bird.setTint(0xffffff);
    this.bird.setBlendMode(1);
    this.bird.setAngle(0);
    this.bird.setData("alive", true);
    this.bird.setData("score", 0);
    this.bird.setData("jumps", 0);
    this.bird.setData("dead", false);
    this.bird.setData("hit", false);
    this.bird.setData("hitGround", false);
    this.bird.setData("hitPipe", false);
    this.bird.setData("hitWall", false);
    this.bird.setData("hitCeiling", false);
    this.bird.setData("hitFloor", false);
    this.bird.setData("hitObstacle", false);
    this.bird.setData("hitObstacleType", null);
    this.bird.setData("hitObstacleData", null);
    this.bird.setData("hitObstacleIndex", null);
    this.bird.setData("hitObstacleGroup", null);
    this.bird.setData("hitObstacleGroupIndex", null);
    this.bird.setData("hitObstacleGroupData", null);
    this.bird.setData("hitObstacleGroupDataIndex", null);
    this.bird.setData("hitObstacleGroupDataKey", null);
    this.bird.setData("hitObstacleGroupDataValue", null);
    this.bird.setData("hitObstacleGroupDataValues", null);
    this.bird.setData("hitObstacleGroupDataValuesIndex", null);
    this.bird.setData("hitObstacleGroupDataValuesLength", null);
    this.bird.setData("hitObstacleGroupDataValuesLengthIndex", null);
    this.bird.setData("hitObstacleGroupDataValuesLengthIndex", null);
    this.bird.setData("hitObstacleGroupDataValuesLengthIndex", null);
    this.bird.setData("hitObstacleGroupDataValuesLengthIndex", null);
    this.bird.setData("hitObstacleGroupDataValuesLengthIndex", null);
