function GameManager(size, InputManager, Actuator, ScoreManager) {
  if (!size || !InputManager || !Actuator || !ScoreManager) {
    throw new Error("Invalid arguments");
  }

  this.size = size;
  this.inputManager = InputManager;
  this.scoreManager = ScoreManager;
  this.actuator = Actuator;
  this.startTiles = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));

  this.setup();
}

GameManager.prototype.restart = function () {
  this.setup();
};

GameManager.prototype.gameOver = function () {
  this.over = true;
  this.actuate();
};

GameManager.prototype.gameWon = function () {
  this.won = true;
  this.actuate();
};

GameManager.prototype.isGameTerminated = function () {
  return this.over || this.won;
};

GameManager.prototype.setup = function () {
  this.grid = new Grid(this.size);
  this.score = 0;
  this.over = false;
  this.won = false;
  this.addStartTiles();
  this.actuate();
};

GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = Math.random() < 0.9 ? 2048 : 1024;
    var tile = new Tile(this.grid.randomAvailableCell(), value);
    this.grid.insertTile(tile);
  }
};

GameManager.prototype.actuate = function () {
  this.actuator.actuate(this.grid, {
    score: this.score,
    over: this.over,
    won: this.won,
    bestScore: this.scoreManager.get(),
    terminated: this.isGameTerminated()
  });
};

GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};

GameManager.prototype.move = function (direction) {
  if (this.isGameTerminated()) return;

  var vector = this.getVector(direction);
  var traversals = this.buildTraversals(vector);

  this.prepareTiles();
  this.moveTiles(traversals, vector);

  if (this.hasMoved()) {
    this.addRandomTile();
    if (!this.movesAvailable()) {
      this.gameOver();
    }
    this.actuate();
  }
};

GameManager.prototype.getVector = function (direction) {
  const map = {
    0: { x: 0, y: -1 }, // up
    1: { x: 1, y: 0 },  // right
    2: { x: 0, y: 1 },  // down
    3: { x: -1, y: 0 } // left
  };
  return map[direction];
};

GameManager.prototype.buildTraversals = function (vector) {
  const traversals = { x: [], y: [] };

  for (let pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.moveTiles = function (traversals, vector) {
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      const cell = { x, y };
      const tile = this.grid.cellContent(cell);

      if (tile) {
        const positions = this.findFarthestPosition(cell, vector);
        const next = this.grid.cellContent(positions.next);

        if (next && next.value === tile.value && !next.mergedFrom) {
          const merged = new Tile(positions.next, tile.value / 2);
          merged.mergedFrom = [tile, next];
          this.grid.insertTile(merged);
          this.grid.removeTile(tile);
          tile.updatePosition(positions.next);
          this.score += merged.value;
          if (merged.value === 1) this.gameWon();
        } else {
          this.moveTile(tile, positions.farthest);
        }
      }
    }, this);
  }, this);
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  let previous = cell;
  let cell = { x: previous.x + vector.x, y: previous.y + vector.y };

  while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell)) {
    previous = cell;
    cell = { x: previous.x + vector.x, y: previous.y + vector.y };
  }

  return {
    farthest: previous,
    next: cell
  };
};

GameManager.prototype.hasMoved = function () {
  let moved = false;
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      if (!this.positionsEqual(tile.previous, { x, y })) {
        moved = true;
      }
    }
  }, this);
  return moved;
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

GameManager.prototype.tileMatchesAvailable = function () {
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      const tile = this.grid.cellContent({ x, y });
      if (tile) {
        for (let direction = 0; direction < 4; direction++) {
          const vector = this.getVector(direction);
          const cell = { x: x + vector.x, y: y + vector.y };
          const other = this.grid.cellContent(cell);
          if (other && other.value === tile.value) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
