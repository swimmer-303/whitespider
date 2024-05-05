"use strict";

$(document).ready(() => {
  initialize();
});

const framerate = 60;
const numHighScores = 3;
const hexagonBackgroundColor = 'rgb(236, 240, 241)';
const hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
const centerBlue = 'rgb(44,62,80)';
const angularVelocityConst = 4;
const scoreOpacity = 0;
const textOpacity = 0;
const rush = 1;
const lastTime = Date.now();
let iframHasLoaded = false;
const colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
const hexColorsToTintedColors = {
  "#e74c3c": "rgb(241,163,155)",
  "#f1c40f": "rgb(246,223,133)",
  "#3498db": "rgb(151,201,235)",
  "#2ecc71": "rgb(150,227,183)"
};
const rgbToHex = {
  "rgb(231,76,60)": "#e74c3c",
  "rgb(241,196,15)": "#f1c40f",
  "rgb(52,152,219)": "#3498db",
  "rgb(46,204,113)": "#2ecc71"
};
const rgbColorsToTintedColors = Object.assign({}, hexColorsToTintedColors);
let canvas, ctx, trueCanvas, settings, highscores, blocks, raf;
let gameState, score, scoreAdditionCoeff, prevScore, gdx, gdy, devMode, lastGen,
  prevTimeScored, nextGen, spawnLane, importedHistory, startTime, canRestart;

function initialize(a) {
  window.rush = rush;
  window.lastTime = lastTime;
  window.iframHasLoaded = iframHasLoaded;
  window.colors = colors;
  window.s
