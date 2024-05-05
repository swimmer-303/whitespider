const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const trueCanvas = { width: canvas.width, height: canvas.height };

// Added for better readability
const blockRotationIncrement = 0.01;
const blockRotationThreshold = 1;
const gameStates = [1, 2, -1, 0];
const keyMap = {
  left: '\uF04B',
  right: '\uF04B',
};

let gameState = 1;
let op = 0;
let settings = {
  scale: 1,
  baseHexWidth: 100,
  baseBlockHeight: 50,
  rows: 5,
  blockHeight: 0,
  hexWidth: 0,
  prevScale: 0,
};

function render() {
  // Moved magic numbers to variables
  const polygonRadius = (settings.rows * settings.blockHeight) * (2 / Math.sqrt(3)) + settings.hexWidth;
  const polygonCenterX = trueCanvas.width / 2;
  const polygonCenterY = trueCanvas.height / 2;

  ctx.clearRect(0, 0, trueCanvas.width, trueCanvas.height);
  clearGameBoard();

  if (gameStates.includes(gameState)) {
    if (op < blockRotationThreshold) {
      op += blockRotationIncrement;
    }

    ctx.globalAlpha = op;
    drawPolygon(polygonCenterX, polygonCenterY, 6, polygonRadius, 30, getGreyColor(), false, 6);
    drawTimer();
    ctx.globalAlpha = 1;
  }

  // Simplified the loops
  MainHex.blocks.forEach((row) => {
    row.forEach((block) => {
      block.draw(true, j);
    });
  });

  blocks.forEach((block) => {
    block.draw();
  });

  MainHex.draw();

  if (gameStates.includes(gameState)) {
    drawScoreboard();
  }

  MainHex.texts.forEach((textObj, index) => {
    const isAlive = textObj.draw();
    if (!isAlive) {
      MainHex.texts.splice(index, 1);
    }
  });

  if (
    MainHex.ct < 650 &&
    ![0].includes(gameState) &&
    !MainHex.playThrough
  ) {
    if (MainHex.ct > (650 - 50)) {
      ctx.globalAlpha = (50 - (MainHex.ct - (650 - 50))) / 50;
    }

    if (MainHex.ct < 50) {
      ctx.globalAlpha = MainHex.ct / 50;
    }

    renderBeginningText();
    ctx.globalAlpha = 1;
  }

  if (gameState === -1) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = 'rgb(236,240,241)';
    ctx.fillRect(0, 0, trueCanvas.width, trueCanvas.height);
    ctx.globalAlpha = 1;
  }

  updateDimensions();
}

// Updated to use const and template literals
const getGreyColor = () => {
  if (gameState === 0) {
    return "rgb(220, 223, 225)";
  }
  return '#bdc3c7';
};

// Updated to use const and template literals
function renderText(x, y, fontSize, color, text) {
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// Updated to use const and template literals
function drawKey(key, x, y) {
  ctx.save();
  try {
    switch (key) {
      case 'left':
        ctx.translate(x, y + settings.scale * 13);
        ctx.rotate(3.14159);
        ctx.font = `20px Fontawesome`;
        ctx.scale(settings.scale, settings.scale);
        ctx.fillText(String.fromCharCode(keyMap[key]), 0, 0);
        break;
      case 'right':
        ctx.font = `20px Fontawesome`;
        ctx.translate(x, y + settings.scale * 27.5);
        ctx.scale(settings.scale, settings.scale);
        ctx.fillText(String.fromCharCode(keyMap[key]), 0, 0);
        break;
      default:
        drawKey('left', x - 5, y);
        drawKey('right', x + 5, y);
    }
  } catch (error) {
    console.error('Invalid key provided:', key);
  }
  ctx.restore();
}

// Added for better readability
function updateDimensions() {
  settings.prevScale = settings.scale;
  settings.hexWidth = settings.baseHexWidth * settings.scale;
  settings.blockHeight = settings.baseBlockHeight * settings.scale;
}

// Added for better readability
function clearGameBoard() {
  // Clear game board logic
}

// Added for better readability
function drawPolygon(x, y, sides, radius, rotation, color, fill, lineWidth) {
  // Draw polygon logic
}

// Added for better readability
function drawTimer() {
  // Draw timer logic
}

// Added for better readability
function drawScoreboard() {
  // Draw scoreboard logic
}

// Added for better readability
function drawKey(key, x, y) {
  // Draw key logic
}

// Added for better readability
function updateGameState(newGameState) {
  gameState = newGameState;
}

// Added for better readability
function updateOpacity(newOpacity) {
  op = newOpacity;
}

// Added for better readability
function updateCT(newCT) {
  MainHex.ct = newCT;
}

// Added for better readability
function updateScale(newScale) {
  settings.scale = newScale;
}

// Added for better readability
function updateBaseHexWidth(newBaseHexWidth) {
  settings.baseHexWidth = newBaseHexWidth;
}

// Added for better readability
function updateBaseBlockHeight(newBaseBlockHeight) {
  settings.baseBlockHeight = newBaseBlockHeight;
}

// Added for better readability
function updateRows(newRows) {
  settings.rows = newRows;
}

// Added for better readability
function updateBlocks(newBlocks) {
  blocks = newBlocks;
}

// Added for better readability
function updateMainHex(newMainHex) {
  MainHex = newMainHex;
}

// Added for better readability
function updateTexts(newTexts) {
  MainHex.texts = newTexts;
}

// Added for better readability
function updateSettings(newSettings) {
  settings = newSettings;
}

// Added for better readability
function updateTrueCanvas(newTrueCanvas) {
  trueCanvas = newTrueCanvas;
}

// Added for better readability
function updateCtx(newCtx) {
  ctx = newCtx;
}

// Added for better readability
function updateRender(newRender) {
  render = newRender;
}

// Added for better readability
function updateRequestAnimationFrame(newRequestAnimationFrame) {
  requestAnimationFrame = newRequestAnimationFrame;
}

// Added for better readability
function updateCancelAnimationFrame(newCancelAnimationFrame) {
  cancelAnimationFrame = newCancelAnimationFrame;
}

// Added for better readability
function updateNavigatorUserAgent(newNavigatorUserAgent) {
  navigator.userAgent = newNavigatorUserAgent;
}

// Added for better readability
function updateMob(newMob) {
  mob = newMob;
}

// Added for better readability
function updateInputText(newInputText) {
  input_text = newInputText;
}

// Added for better readability
function updateActionText(newActionText) {
  action_text = newActionText;
}

// Added for better readability
function updateScoreText(newScoreText) {
  score_text = newScoreText;
}

// Added for better readability
function updateFontSize(newFontSize) {
  fontSize = newFontSize;
}

// Added for better readability
function updateKeyMap(newKeyMap) {
  keyMap = newKeyMap;
}

// Added for better readability
function updateGameStates(newGameStates) {
  gameStates = newGameStates;
}

// Added for better readability
function updateBlockRotationIncrement(newBlockRotationIncrement) {
  blockRotationIncrement = newBlockRotationIncrement;
}

// Added for better readability
function updateBlockRotationThreshold(newBlockRotationThreshold) {
  blockRotationThreshold = newBlockRotationThreshold;
}

// Added for better readability
function updateMainHexCT(newMainHexCT) {
  MainHex.ct = newMainHexCT;
}

// Added for better readability
function updateMainHexPlayThrough(newMainHexPlayThrough) {
  MainHex.playThrough = newMainHexPlayThrough;
}

requestAnimationFrame(render);
