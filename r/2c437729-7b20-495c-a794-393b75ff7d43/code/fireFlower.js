/**
 * Represents a fire powerup.
 * Code by Rob Kleffner, 2011
 */

class FireFlower extends NotchSprite {
  constructor(world, x, y) {
    super(world, x, y, 4, 24, Enjine.Resources.Images["items"]);

    this.imageOffsetX = 8;
    this.imageOffsetY = 15;
    this.imageIndexX = 1;
    this.imageIndexY = 0;
    this.height = 12;
    this.facing = 1;
    this.imageWidth = this.imageHeight = 16;
    this.life = 0;
  }

  collideCheck() {
    const xMarioD = Mario.MarioCharacter.X - this.X,
      yMarioD = Mario.MarioCharacter.Y - this.Y;

    if (xMarioD > -16 && xMarioD < 16) {
      if (yMarioD > -this.height && yMarioD < Mario.MarioCharacter.Height) {
        Mario.MarioCharacter.getFlower();
        this.world.removeSprite(this);
      }
    }
  }

  move() {
    if (this.life < 9) {
      this.layer = 0;
      this.Y--;
      this.life++;
    }
  }
}
