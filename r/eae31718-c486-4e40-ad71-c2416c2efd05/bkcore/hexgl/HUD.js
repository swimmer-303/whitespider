/*
 * HexGL HUD
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * @license This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *          To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/.
 */

class HexGLHUD {
  constructor(opts) {
    this.visible = true;
    this.messageOnly = false;

    this.width = opts.width;
    this.height = opts.height;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.textAlign = "center";

    this.bg = opts.bg;
    this.fgspeed = opts.speed;
    this.fgshield = opts.shield;

    this.speedFontRatio = 24;
    this.speedBarRatio = 2.91;
    this.shieldFontRatio = 64;
    this.shieldBarYRatio = 34;
    this.shieldBarWRatio = 18.3;
    this.shieldBarHRatio = 14.3;
    this.timeMarginRatio = 18;
    this.timeFontRatio = 19.2;

    this.font = opts.font || "Arial";

    this.time = "";

    this.message = "";
    this.previousMessage = "";
    this.messageTiming = 0;
    this.messagePos = 0.0;
    this.messagePosTarget = 0.0;
    this.messagePosTargetRatio = 12;
    this.messageA = 1.0;
    this.messageAS = 1.0;
    this.messageDuration = 2 * 60;
    this.messageDurationD = 2 * 60;
    this.messageDurationS = 30;
    this.messageYRatio = 34;
    this.messageFontRatio = 10;
    this.messageFontRatioStart = 6;
    this.messageFontRatioEnd = 10;
    this.messageFontLerp = 0.4;
    this.messageLerp = 0.4;
    this.messageFontAlpha = 0.8;

    this.lapMarginRatio = 14;
    this.lap = "";
    this.lapSeparator = "/";

    this.timeSeparators = ["", "'", "''", ""];

    this.step = 0;
    this.maxStep = 2;
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  drawImageProportionally(image, width, height) {
    const ctx = this.ctx;
    const imgWidth = image.width;
    const imgHeight = image.height;
    const aspectRatio = imgHeight / imgWidth;

    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    ctx.drawImage(image, 0, 0, width, height);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  display(msg, duration) {
    this.messageTiming = 0;

    if (this.message != "") {
      this.messageA = this.messageFontAlpha;
      this.messagePos = 0.0;
      this.messagePosTarget = this.width / this.messagePosTargetRatio;
      this.previousMessage = this.message;
    }

    this.messageFontRatio = this.messageFontRatioStart;
    this.messageAS = 0.0;
    this.message = msg;
    this.messageDuration = duration == undefined ? this.messageDurationD : duration * 60;
  }

  updateLap(current, total) {
    this.lap = current + this.lapSeparator + total;
  }

  resetLap() {
    this.lap = "";
  }

  updateTime(time) {
    this.time =
      this.timeSeparators[0] +
      time.m +
      this.timeSeparators[1] +
      time.s +
      this.timeSeparators[2] +
      time.ms +
      this.timeSeparators[3];
  }

  resetTime() {
    this.time = "";
  }

  update(speed, speedRatio, shield, shieldRatio) {
    const SCREEN_WIDTH = this.width;
    const SCREEN_HEIGHT = this.height;

    const SCREEN_HW = SCREEN_WIDTH / 2;
    const SCREEN_HH = SCREEN_HEIGHT / 2;

    if (!this.visible) {
      this.clear();
      return;
    }

    this.drawImageProportionally(this.bg, SCREEN_WIDTH, SCREEN_HEIGHT);

    const ba = SCREEN_HEIGHT / 3;
    const bl = SCREEN_WIDTH / this.speedBarRatio;
    const bw = bl * speedRatio;

    const sw = SCREEN_WIDTH / this.shieldBarWRatio;
    const sho = SCREEN_WIDTH / this.shieldBarHRatio;
    const sh = sho * shieldRatio;
    const sy = (SCREEN_WIDTH / this.shieldBarYRatio) + sho - sh;

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.fillRect(SCREEN_HW - bw / 2, SCREEN_HEIGHT - ba, bw, ba);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.fillRect(SCREEN_HW - sw / 2, sy, sw, sh);

    // SPEED
    this.ctx.font = (SCREEN_WIDTH / this.speedFontRatio) + "px " + this.font;
    this.ctx.fillText(speed, SCREEN_HW, SCREEN_HEIGHT - ba / 2);

    // SHIELD
    this.ctx.font = (SCREEN_WIDTH / this.shieldFontRatio) + "px " + this.font;
    this.ctx.fillText(shield, SCREEN_HW, sy + sh / 2);

    this.messageTiming++;

    this.step++;
    if (this.step == this.maxStep) this.step = 0;
  }
}
