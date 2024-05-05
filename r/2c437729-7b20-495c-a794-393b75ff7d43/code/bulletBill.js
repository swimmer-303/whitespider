/**
 * Represents a bullet bill enemy.
 * Code by Rob Kleffner, 2011
 */

const WIDTH = 4;
const HEIGHT = 12;
const SIDEWAYS_SPEED = 4;
const DEAD_TIME_MAX = 100;
const SPARKLE_COUNT = 8;
const SPARKLE_SPEED_X = [1, -1];
const SPARKLE_SPEED_Y = [-1, -1];
const SPARKLE_LIFETIME = 5;

class BulletBill extends Mario.NotchSprite {
  constructor(world, x, y, dir) {
    super();
    this.Image = Enjine.Resources.Images["enemies"];
    this.World = world;
    this.X = x;
    this.Y = y;
    this.Facing = dir;
    this.DeadTime = 0;
    this.Dead = false;
    this.Anim = 0;
  }

  /**
   * Check for collisions with Mario.
   */
  CollideCheck() {
    if (this.Dead) {
      return;
    }

    const xMarioD = Mario.MarioCharacter.X - this.X;
    const yMarioD = Mario.MarioCharacter.Y - this.Y;
    if (xMarioD > -WIDTH && xMarioD < WIDTH) {
      if (yMarioD > -HEIGHT && yMarioD < Mario.MarioCharacter.Height) {
        if (
          Mario.MarioCharacter.Y > 0 &&
          yMarioD <= 0 &&
          (!Mario.MarioCharacter.OnGround || !Mario.MarioCharacter.WasOnGround)
        ) {
          Mario.MarioCharacter.Stomp(this);
          this.Dead = true;

          this.Xa = 0;
          this.Ya = 1;
          this.DeadTime = DEAD_TIME_MAX;
        } else {
          Mario.MarioCharacter.GetHurt();
        }
      }
    }
  }

  /**
   * Move the bullet bill.
   */
  Move() {
    if (this.DeadTime > 0) {
      this.DeadTime--;

      if (this.DeadTime === 0) {
        this.DeadTime = 1;
        for (let i = 0; i < SPARKLE_COUNT; i++) {
          const x = (this.X + Math.random() * 16 - 8) | 0;
          const y = (this.Y + Math.random() * 8) | 0;
          const speedX = Math.random() * 2 - 1;
          const speedY = Math.random() * -1;
          this.World.AddSprite(
            new Mario.Sparkle(x + 4, y + 4, speedX, speedY, 0, 1, SPARKLE_LIFETIME)
          );
        }
        this.World.RemoveSprite(this);
        return;
      }

      this.X += this.Xa;
      this.Y += this.Ya;
      this.Ya *= 0.95;
      this.Ya += 1;

      return;
    }

    this.Xa = this.Facing * SIDEWAYS_SPEED;
    this.XFlip = this.Facing === -1;
    this.Move(this.Xa, 0);
  }

  /**
   * Move the bullet bill by a given amount.
   */
  SubMove(xa, ya) {
    this.X += xa;
    return true;
  }

  /**
   * Check for collisions with a fireball.
   */
  FireballCollideCheck(fireball) {
    if (this.DeadTime !== 0) {
      return false;
    }

    const xD = fireball.X - this.X;
    const yD = fireball.Y - this.Y;
    if (xD > -WIDTH && xD < WIDTH) {
      if (yD > -HEIGHT && yD < fireball.Height) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check for collisions with a shell.
   */
  ShellCollideCheck(shell) {
    if (this.DeadTime !== 0) {
      return false;
    }

    const xD = shell.X - this.X;
    const yD = shell.Y - this.Y;
    if (xD > -WIDTH && xD < WIDTH) {
      if (yD > -HEIGHT && yD < shell.Height) {
        Enjine.Resources.PlaySound("kick");
        this.Dead = true;
        this.Xa = 0;
        this.Ya = 1;
        this.DeadTime = DEAD_TIME_MAX;
        return true;
      }
    }
    return false;
  }
}
