function drawTimer() {
  if (gameState !== 1) return; // return early if gameState is not 1

  const leftVertexes = [];
  const rightVertexes = [];

  if (MainHex.ct - MainHex.lastCombo < settings.comboTime) {
    for (let i = 0; i < 6; i++) {
      const done = MainHex.ct - MainHex.lastCombo;
      if (done < settings.comboTime * (5 - i) / 6) {
        leftVertexes.push(calcSide(i, i + 1, 1, 1));
        rightVertexes.push(calcSide(12 - i, 11 - i, 1, 1));
      }
    }
  }

  if (rightVertexes.length > 0) drawSide(rightVertexes);
  if (leftVertexes.length > 0) drawSide(leftVertexes);
}

function calcSide(startVertex, endVertex, fraction, offset) {
  startVertex = (startVertex + offset) % 12;
  endVertex = (endVertex + offset) % 12;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.lineCap = "round";

  const radius =
    (settings.rows * settings.blockHeight) * (2 / Math.sqrt(3)) + settings.hexWidth;
  const halfRadius = radius / 2;
  const triHeight = radius * (Math.sqrt(3) / 2);
  const Vertexes = [
    [(halfRadius * 3) / 2, triHeight / 2],
    [radius, 0],
    [(halfRadius * 3) / 2, -triHeight / 2],
    [halfRadius, -triHeight],
    [0, -triHeight],
    [-halfRadius, -triHeight],
    [-(halfRadius * 3) / 2, -triHeight / 2],
    [-radius, 0],
    [-(halfRadius * 3) / 2, triHeight / 2],
    [-halfRadius, triHeight],
    [0, triHeight],
    [halfRadius, triHeight],
  ].reverse();
  const startX = trueCanvas.width / 2 + Vertexes[startVertex][0];
  const startY = trueCanvas.height / 2 + Vertexes[startVertex][1];
  const endX = trueCanvas.width / 2 + Vertexes[endVertex][0];
  const endY = trueCanvas.height / 2 + Vertexes[endVertex][1];

  return [[startX, startY], [(endX - startX) * fraction + startX, (endY - startY) * fraction + startY]];
}

function drawSide(vertexes) {
  if (gameState === 0) {
    ctx.strokeStyle = hexColorsToTintedColors[MainHex.lastColorScored];
  } else {
    ctx.strokeStyle = MainHex.lastColorScored;
  }

  if (settings.scale === 0) {
    console.error("settings.scale cannot be zero");
    return;
  }

  ctx.lineWidth = 4 * settings.scale;

  if (vertexes.length < 2) {
    console.error("vertexes array must have at least 2 elements");
    return;
  }

  ctx.moveTo(vertexes[0][0][0], vertexes[0][0][1]);
  ctx.lineTo(vertexes[0][1][0], vertexes[0][1][1]);

  for (let i = 1; i < vertexes.length; i++) {
    ctx.lineTo(vertexes[i][1][0], vertexes[i][1][1]);
    ctx.moveTo(vertexes[i][1][0], vertexes[i][1][1]);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
