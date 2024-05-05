/**
 * Base class to represent a double buffered canvas object.
 * Code by Rob Kleffner, 2011
 */

class GameCanvas {
  constructor() {
    this.canvas = null;
    this.context2D = null;
    this.backBuffer = null;
    this.backBufferContext2D = null;
  }

  initialize(canvasId, resWidth, resHeight) {
    this.canvas = document.getElementById(canvasId);
    this.context2D = this.canvas.getContext("2d");
    this.backBuffer = document.createElement("canvas");
    this.backBuffer.width = resWidth;
    this.backBuffer.height = resHeight;
    this.backBufferContext2D = this.backBuffer.getContext("2d");
  }

  beginDraw() {
    this.backBufferContext2D.clearRect(
      0,
      0,
      this.backBuffer.width,
      this.backBuffer.height
    );
    this.context2D.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  endDraw() {
    this.context2D.drawImage(
      this.backBuffer,
      0,
      0,
      this.backBuffer.width,
      this.backBuffer.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }
}
