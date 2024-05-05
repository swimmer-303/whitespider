const angularVelocityConst = 0.1;
const gdx = 0;
const gdy = 0;

function Block(fallingLane, color, iter, distFromHex, settled) {
  const DEFAULT_SETTLED = 0;
  const DEFAULT_DIST_FROM_HEX = settings.startDist * settings.scale;

  this.settled = settled === undefined ? DEFAULT_SETTLED : 1;
  this.height = settings.blockHeight;
  this.fallingLane = fallingLane;
  this.checked = 0;
  this.angle = 90 - (30 + 60 * fallingLane);
  this.angularVelocity = 0;
  this.targetAngle = this.angle;
  this.color = color;
  this.deleted = 0;
  this.removed = 0;
  this.tint = 0;
  this.opacity = 1;
  this.initializing = 1;
  this.ict = MainHex.ct;
  this.iter = iter;
  this.initLen = settings.creationDt;
  this.attachedLane = 0;
  this.distFromHex = distFromHex || DEFAULT_DIST_FROM_HEX;

  this.incrementOpacity = function () {
    if (this.deleted === undefined) {
      throw new Error('deleted is undefined');
    }

    if (this.deleted) {
      //add shakes
      if (this.opacity >= 0.925) {
        const tLane = ((this.attachedLane - MainHex.position) + MainHex.sides) % MainHex.sides;
        MainHex.shakes.push({ lane: tLane, magnitude: 3 * (window.devicePixelRatio || 1) * (settings.scale) });
      }

      //fade out the opacity
      this.opacity -= 0.075 * MainHex.dt;
      if (this.opacity <= 0) {
        //slate for final deletion
        this.opacity = 0;
        this.deleted = 2;
        if ([1, 0].includes(gameState)) {
          localStorage.setItem('saveState', exportSaveState());
        }
      }
    }
  };

  this.getIndex = function () {
    const parentArr = MainHex.blocks[this.attachedLane];
    for (let i = 0; i < parentArr.length; i++) {
      if (parentArr[i] === this) {
        return i;
      }
    }
  };

  this.draw = function (attached, index) {
    this.height = settings.blockHeight;
    const scaleRatio = (settings.scale || 1) / (settings.prevScale || 1);
    if (Math.abs(scaleRatio - 1) > 0.000000001) {
      this.distFromHex *= scaleRatio;
    }

    this.incrementOpacity();
    attached = attached === undefined ? false : attached;

    const angularVelocity = this.angle > this.targetAngle ? this.angularVelocity - angularVelocityConst * MainHex.dt : this.angularVelocity + angularVelocityConst * MainHex.dt;
    if (Math.abs(this.angle - this.targetAngle + angularVelocity) <= Math.abs(this.angularVelocity)) {
      this.angle = this.targetAngle;
      this.angularVelocity = 0;
    } else {
      this.angle += angularVelocity;
    }

    const width = 2 * this.distFromHex / Math.sqrt(3);
    const widthWide = 2 * (this.distFromHex + this.height) / Math.sqrt(3);
    let p1, p2, p3, p4;
    if (this.initializing) {
      const rat = Math.min(1, ((MainHex.ct - this.ict) / this.initLen));
      p1 = rotatePoint((-width / 2) * rat, this.height / 2, this.angle);
      p2 = rotatePoint((width / 2) * rat, this.height / 2, this.angle);
      p3 = rotatePoint((widthWide / 2) * rat, -this.height / 2, this.angle);
      p4 = rotatePoint((-widthWide / 2) * rat, -this.height / 2, this.angle);
      if (MainHex.ct - this.ict >= this.initLen) {
        this.initializing = 0;
      }
    } else {
      p1 = rotatePoint(-width / 2, this.height / 2, this.angle);
      p2 = rotatePoint(width / 2, this.height / 2, this.angle);
      p3 = rotatePoint(widthWide / 2, -this.height / 2, this.angle);
      p4 = rotatePoint(-widthWide / 2, -this.height / 2, this.angle);
    }

    const fillStyle = this.deleted ? '#FFF' : (gameState === 0 ? (this.color.startsWith('r') ? rgbColorsToTintedColors[this.color] : hexColorsToTintedColors[this.color]) : this.color);
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = this.opacity;
    const baseX = (trueCanvas.width / 2) + Math.sin(this.angle * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdx;
    const baseY = (trueCanvas.height / 2) - Math.cos(this.angle * (Math.PI / 180)) * (this.distFromHex + this.height / 2) + gdy;
    ctx.beginPath();
    ctx.moveTo(baseX + p1.x, baseY + p1.y);
    ctx.lineTo(baseX + p2.x, baseY + p2.y);
    ctx.lineTo(baseX + p3.x, baseY + p3.y);
    ctx.lineTo(baseX + p4.x, baseY + p4.y);
    ctx.closePath();
    ctx.fill();

    if (this.tint) {
      if (this.opacity < 1) {
        if ([1, 0].includes(gameState)) {
          localStorage.setItem('saveState', exportSaveState());
        }

        this.iter = 2.25;
        this.tint = 0;
      }

      ctx.fillStyle = '#FFF';
      ctx.globalAlpha = this.tint;
      ctx.beginPath();
      ctx.moveTo(baseX + p1.x, baseY + p1.y);
      ctx.lineTo(baseX + p2.x, baseY + p2.y);
      ctx.lineTo(baseX + p3.x, baseY + p3.y);
      ctx.lineTo(baseX + p4.x, baseY + p4.y);
      ctx.closePath();
      ctx.fill();
      this.tint -= 0.02 * MainHex.dt;
      if (this.tint < 0) {
        this.tint = 0;
      }
    }

    ctx.globalAlpha = 1;
  };
}

function findCenterOfBlocks(arr) {
  let avgDFH = 0;
  let avgAngle = 0;
  for (let i = 0; i < arr.length; i++) {
    avgDFH += arr[i].distFromHex;
    const ang = arr[i].angle % 360;
    avgAngle += ang;
  }

  avgDFH /= arr.length;
  avgAngle /= arr.length;

  return {
    x: (trueCanvas.width / 2) + Math.cos(avgAngle * (Math.PI / 180)) * avgDFH,
    y: (trueCanvas.height / 2) - Math.sin(avgAngle * (Math.PI / 180)) * avgDFH
  };
}
