function Tile(position, value = 2) {
  Object.assign(this, {
    x: position.x,
    y: position.y,
    value,
    previousPosition: null,
    mergedFrom: null
  });
}

Tile.prototype.move = function (position) {
  this.savePosition();
  this.updatePosition(position);
};

Tile.prototype.updatePosition = function (position) {
  this.x = position.x;
  this.y = position.y;
};

Tile.prototype.savePosition = function () {
  this.previousPosition = { x: this.x, y: this.y };
};

Tile.prototype.set = function (value, position) {
  this.value = value;
  this.move(position);
};

Tile.prototype.serialize = function () {
  return {
    position: {
      x: this.x,
      y: this.y
    },
    value: this.value
  };
};

Tile.prototype.copy = function () {
  return new Tile(this.serialize());
};
