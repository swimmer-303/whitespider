// Constructor function for Text object
function Text(x, y, text, font, color) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;
  this.opacity = 1;
  this.text = text;
  this.alive = true;
}

// Rendering function for text
function renderText(x, y, fontSize, color, text) {
  ctx.font = fontSize + "px Arial";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// Function to fade up and out the text
function fadeUpAndOut(text) {
  if (MainHex && ctx) {
    text.opacity -= MainHex.dt * Math.pow(Math.pow((1 - text.opacity), 1 / 3) + 1, 3) / 100;
    text.alive = text.opacity > 0;
    text.y -= 3 * MainHex.dt;
  }
}
