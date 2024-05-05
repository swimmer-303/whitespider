// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class CanvasRenderingContext2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.context_ = new H(this);
  }

  // ... (other methods omitted for brevity)

  clearRect() {
    this.element_.innerHTML = "";
  }

  beginPath() {
    this.currentPath_ = [];
  }

  moveTo(x, y) {
    const coords = this.getCoords_(x, y);
    this.currentPath_.push({ type: "moveTo", x: coords.x, y: coords.y });
    this.currentX_ = coords.x;
    this.currentY_ = coords.y;
  }

  lineTo(x, y) {
    const coords = this.getCoords_(x, y);
    this.currentPath_.push({ type: "lineTo", x: coords.x, y: coords.y });
    this.currentX_ = coords.x;
    this.currentY_ = coords.y;
  }

  // ... (other methods omitted for brevity)

  getCoords_(x, y) {
    const matrix = this.m_;
    return {
      x: k * (matrix[0][0] * x + matrix[1][0] * y + matrix[2][0]) - v,
      y: k * (matrix[0][1] * x + matrix[1][1] * y + matrix[2][1]) - v,
    };
  }

  save() {
    const state = {};
    Object.assign(state, this);
    this.aStack_.push(state);
    this.mStack_.push(this.m_);
    this.m_ = y(I(), this.m_);
  }

  restore() {
    Object.assign(this, this.aStack_.pop());
    this.m_ = this.mStack_.pop();
  }

  // ... (other methods omitted for brevity)
}

class H {
  constructor(context) {
    this.m_ = I();
    this.mStack_ = [];
    this.aStack_ = [];
    this.currentPath_ = [];
    this.fillStyle = "#000";
    this.strokeStyle = "#000";
    this.lineWidth = 1;
    this.lineJoin = "miter";
    this.lineCap = "butt";
    this.miterLimit = k * 1;
    this.globalAlpha = 1;
    this.canvas = context.canvas;
    this.element_ = document.createElement("div");
    this.element_.style.width = `${context.canvas.clientWidth}px`;
    this.element_.style.height = `${context.canvas.clientHeight}px`;
    this.element_.style.overflow = "hidden";
    this.element_.style.position = "absolute";
    context.canvas.appendChild(this.element_);
  }

  // ... (other methods omitted for brevity)
}

// ... (other classes omitted for brevity)

const G_vmlCanvasManager = M;
CanvasRenderingContext2D = H;
CanvasGradient = D;
CanvasPattern = U;
