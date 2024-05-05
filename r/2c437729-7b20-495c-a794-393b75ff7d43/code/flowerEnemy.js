// Represents a flower enemy.
// Code by Rob Kleffner, 2011

// Constants
const ENEMY_IMAGE = Enjine.Resources.Images["enemies"];
const SPRITE_WIDTH = 2;
const SPRITE_HEIGHT = 12;
const WINGED_ENEMY_Y_PIC_O = 24;
const GRAVITY = 0.1;
const MAX_JUMP_TIME = 40;
const JUMP_VELOCITY = -8;
const SPARKLE_COUNT = 8;
const SPARKLE_LIFETIME = 5;
const DEAD_TIME_MIN = 1;

// FlowerEnemy class
Mario.FlowerEnemy = function(world, x, y) {
  if (!world || !x || !y) {
    throw new Error("world, x, and y are required arguments");
  }

  this.world = world;
  this.x = x;
  this.y = y;
  this.facing = 1;
  this.type = Mario.Enemy.Spiky;
  this.winged = false;
  this.noFireballDeath = false;
  this.xPic = 0;
  this.yPic = 6;
  this.yPicO = this.winged ? WINGED_ENEMY_Y_PIC_O : 6;
  this.height = SPRITE_HEIGHT;
  this.width = SPRITE_WIDTH;
  this.yStart = y;
  this.ya = 0;
  this.layer = 0;
  this.jumpTime = 0;
  this.tick = 0;
  this.deadTime = 0;
};

// Prototype methods
Mario.FlowerEnemy.prototype = new Mario.Enemy();

// Move method
Mario.FlowerEnemy.prototype.move = function() {
  if (this.deadTime > 0) {
    this.deadTime--;

    if (this.deadTime === 0) {
      this.deadTime = DEAD_TIME_MIN;
      for (let i = 0; i < SPARKLE_COUNT; i++) {
        const x = (Math.random() * 16 - 8) | 0 + 4;
        const y = (Math.random() * 8) | 0 + 4;
        const vx = Math.random() * 2 - 1;
        const vy = Math.random() * -1;
        const lifetime = SPARKLE_LIFETIME;
        this.world.addSprite(new Mario.Sparkle(x, y, vx, vy, 0, 1, lifetime));
      }
      this.world.removeSprite(this);
      return;
    }
  } else {
    this.tick++;

    if (this.y >= this.yStart) {
      this.yStart = this.y;
      const xd = Math.abs(Mario.MarioCharacter.X - this.x) | 0;
      this.jumpTime++;

      if (this.jumpTime > MAX_JUMP_TIME && xd > 24) {
        this.ya = JUMP_VELOCITY;
      } else {
        this.ya = 0;
      }
    } else {
      this.jumpTime = 0;
    }

    this.ya += GRAVITY;
    this.y += this.ya;
  }

  this.xPic = (((this.tick / 2) | 0) & 1) * 2 + (((this.tick / 6) | 0) & 1);
};

// Die method
Mario.FlowerEnemy.prototype.die = function() {
  this.deadTime = DEAD_TIME_MIN;
};

// Draw method
Mario.FlowerEnemy.prototype.draw = function(ctx) {
  const x = this.x - this.width / 2;
  const y = this.y - this.height;
  const image = ENEMY_IMAGE;
  const sx = this.xPic * this.width;
  const sy = this.yPicO;
  const sw = this.width;
  const sh = this.height;
  const dx = x;
  const dy = y;
  const dw = sw;
  const dh = sh;

  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
};
