// utils.js
const utils = {
  getCurrentTime: () => performance.now(),
  random: (min, max) => Math.random() * (max - min) + min,
  randomPositiveNegative: () => Math.random() < 0.5 ? -1 : 1,
  isFunction: (fn) => typeof fn === 'function',
  isTouchDevice: () => 'ontouchstart' in window || window.navigator.msMaxTouchPoints,
  requestAnimationFrameTool: (() => {
    let requestAnimationFrame = window.requestAnimationFrame ||
                                  window.webkitRequestAnimationFrame ||
                                  window.mozRequestAnimationFrame ||
                                  window.oRequestAnimationFrame ||
                                  window.msRequestAnimationFrame ||
                                  (callback => window.setTimeout(() => {
                                    const currentTime = utils.getCurrentTime();
                                    callback(currentTime);
                                    const timeToCall = 1000 / 60 - (currentTime - performance.now());
                                    setTimeout(() => requestAnimationFrame(callback), timeToCall);
                                  }, 1000 / 60));

    return requestAnimationFrame;
  }),
  arraySwap: (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
};

// TowerGame.js
class TowerGame {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId);
    if (!this.canvas.getContext) return;

    this.debug = !!options.debug;
    this.width = options.width || window.innerWidth;
    this.height = options.height || window.innerHeight;
    this.highResolution = options.highResolution;
    this.loadLimit = options.loadLimit || 3;
    this.soundOn = !!options.soundOn;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.calWidth = this.width / 2;
    this.calHeight = this.height / 2;

    this.ctx = this.canvas.getContext('2d');

    this.defaultLayer = 'default';
    this.layerArr = [this.defaultLayer];
    this.instancesObj = {
      [this.defaultLayer]: []
    };
    this.instancesReactionArr = [];
    this.utils = utils;
    this.customVariable = {};

    this.isTouchDevice = utils.isTouchDevice();

    this.debugArr = [];
    this.assetsObj = {
      image: {},
      audio: {}
    };
    this.assetsCount = {
      image: 0,
      audio: 0
    };
    this.assetsErrorQueue = [];
    this.assetsErrorCount = 0;

    this.loadLimit = options.loadLimit || 3;
    this.soundOn = !!options.soundOn;

    this.fps = 0;
    this.lastTime = 0;
    this.lastPausedAt = 0;
    this.pausedTime = 0;
    this.paused = false;
    this.timeMovement = {};
    this.timeMovementStartArr = [];
    this.timeMovementFinishArr = [];
    this.keyUpListeners = {};
    this.keyDownListeners = {};
    this.keyPressListeners = {};
    this.startAnimate = () => {};
    this.paintUnderInstance = () => {};
    this.paintAboveInstance = () => {};
    this.endAnimate = () => {};
    this.touchStartListener = () => {};
    this.touchEndListener = () => {};
    this.touchMoveListener = () => {};

    document.addEventListener('keyup', (event) => {
      this.keyListener(event, 'keyup');
    }, false);

    document.addEventListener('keydown', (event) => {
      this.keyListener(event, 'keydown');
    }, false);

    document.addEventListener('keypress', (event) => {
      this.keyListener(event, 'keypress');
    }, false);

    if (this.isTouchDevice) {
      document.addEventListener('touchstart', (event) => {
        this.touchStartListener(event);
      }, false);

      document.addEventListener('touchend', (event) => {
        this.touchEndListener(event);
      }, false);

      document.addEventListener('touchmove', (event) => {
        this.touchMoveListener(event);
      }, false);
    } else {
      document.addEventListener('mousedown', (event) => {
        this.touchStartListener(event);
      }, false);

      document.addEventListener('mouseup', (event) => {
        this.touchEndListener(event);
      }, false);

      document.addEventListener('mousemove', (event) => {
        this.touchMoveListener(event);
      }, false);
    }
  }

  // ... Rest of the code
}
