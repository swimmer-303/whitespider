function KeyboardInputManager(element) {
  if (!window.document) {
    throw new Error("This library only works in a browser environment");
  }

  this.events = {};

  if (window.navigator.msPointerEnabled) {
    //Internet Explorer 10 style
    this.eventTouchstart = "MSPointerDown";
    this.eventTouchmove = "MSPointerMove";
    this.eventTouchend = "MSPointerUp";
  } else {
    this.eventTouchstart = "touchstart";
    this.eventTouchmove = "touchmove";
    this.eventTouchend = "touchend";
  }

  this.element = element || document.body;
  this.gameContainer = this.element.querySelector(".game-container");

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // Vim up
    76: 1, // Vim right
    74: 2, // Vim down
    72: 3, // Vim left
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3 // A
  };

  this.element.addEventListener("keydown", this.onKeyDown.bind(this));

  this.bindButtonPress(".retry-button", this.restart);
  this.bindButtonPress(".restart-button", this.restart);
  this.bindButtonPress(".keep-playing-button", this.keepPlaying);

  this.gameContainer.addEventListener(this.eventTouchstart, this.onTouchStart.bind(this));
  this.gameContainer.addEventListener(this.eventTouchmove, this.onTouchMove.bind(this));
  this.gameContainer.addEventListener(this.eventTouchend, this.onTouchEnd.bind(this));
};

KeyboardInputManager.prototype.onKeyDown = function (event) {
  var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  var mapped = map[event.which];

  if (!modifiers) {
    if (mapped !== undefined) {
      event.preventDefault();
      this.emit("move", mapped);
    }
  }

  if (!modifiers && event.which === 82) {
    this.restart(event);
  }
};

KeyboardInputManager.prototype.onTouchStart = function (event) {
  if ((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches.length > 1) {
    return; // Ignore if touching with more than 1 finger
  }

  if (window.navigator.msPointerEnabled) {
    this.touchStartClientX = event.pageX;
    this.touchStartClientY = event.pageY;
  } else {
    this.touchStartClientX = event.touches[0].clientX;
    this.touchStartClientY = event.touches[0].clientY;
  }

  event.preventDefault();
};

KeyboardInputManager.prototype.onTouchMove = function (event) {
  event.preventDefault();
};

KeyboardInputManager.prototype.onTouchEnd = function (event) {
  if ((!window.navigator.msPointerEnabled && event.touches.length > 0) || event.targetTouches.length > 0) {
    return; // Ignore if still touching with one or more fingers
  }

  if (window.navigator.msPointerEnabled) {
    this.touchEndClientX = event.pageX;
    this.touchEndClientY = event.pageY;
  } else {
    this.touchEndClientX = event.changedTouches[0].clientX;
    this.touchEndClientY = event.changedTouches[0].clientY;
  }

  var dx = this.touchEndClientX - this.touchStartClientX;
  var absDx = Math.abs(dx);

  var dy = this.touchEndClientY - this.touchStartClientY;
  var absDy = Math.abs(dy);

  if (Math.max(absDx, absDy) > 10) {
    // (right : left) : (down : up)
    this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
  }
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
  var button = document.querySelector(selector);
  if (button) {
    button.addEventListener("click", fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
  }
};
