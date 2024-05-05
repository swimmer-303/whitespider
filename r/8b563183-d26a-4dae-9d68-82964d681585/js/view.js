const FONT_AWESOME = 'px FontAwesome';
const EXO_FONT = 'px Exo';
const PAUSE_BUTTON_SVG = './images/btn_pause.svg';
const RESUME_BUTTON_SVG = './images/btn_resume.svg';

// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

function renderText(x, y, fontSize, color, text, font) {
  ctx.save();
  ctx.font = `${fontSize} ${font || EXO_FONT}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.fillText(text, x, y + fontSize / 2 - 9 * settings.scale);
  ctx.restore();
}

function drawScoreboard() {
  const scoreSize = getScoreSize(score.toString().length);
  const color = getColor();
  const fontSize = settings.platform === 'mobile' ? 35 : 30;
  const h = trueCanvas.height / 2 + gdy + 100 * settings.scale;

  ctx.globalAlpha = textOpacity;

  if (gameState === 0) {
    renderText(
      trueCanvas.width / 2 + gdx + 6 * settings.scale,
      trueCanvas.height / 2 + gdy,
      60,
      'rgb(236, 240, 241)',
      String.fromCharCode('0xf04b'),
      FONT_AWESOME
    );
    renderText(
      trueCanvas.width / 2 + gdx + 6 * settings.scale,
      trueCanvas.height / 2.1 + gdy - 155 * settings.scale,
      150,
      '#2c3e50',
      'Hextris'
    );
    renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h + 10, fontSize, 'rgb(44,62,80)', 'Play!');
  } else if (gameState !== 0 && textOpacity > 0) {
    textOpacity -= 0.05;

    renderText(
      trueCanvas.width / 2 + gdx + 6 * settings.scale,
      trueCanvas.height / 2 + gdy,
      60,
      'rgb(236, 240, 241)',
      String.fromCharCode('0xf04b'),
      FONT_AWESOME
    );
    renderText(
      trueCanvas.width / 2 + gdx + 6 * settings.scale,
      trueCanvas.height / 2 + gdy - 155 * settings.scale,
      150,
      '#2c3e50',
      'Hextris'
    );
    renderText(trueCanvas.width / 2 + gdx + 5 * settings.scale, h, fontSize, 'rgb(44,62,80)', 'Play!');

    ctx.globalAlpha = scoreOpacity;
    renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
  } else {
    ctx.globalAlpha = scoreOpacity;
    renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
  }

  ctx.globalAlpha = 1;
}

function getScoreSize(length) {
  switch (length) {
    case 6:
      return 43;
    case 7:
      return 35;
    case 8:
      return 31;
    case 9:
      return 27;
    default:
      return 50;
  }
}

function getColor() {
  // if (rush === 1) {
  //   return 'rgb(236, 240, 241)';
  // }
  return 'rgb(44,62,80)';
}

// ... Rest of the code
