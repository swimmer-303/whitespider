/**
 * Grid class representing the game board
 */
class Grid {
  constructor(size) {
    this.size = size;
    this.cells = this.createCells();
  }

  createCells() {
    return Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => null)
    );
  }

  randomAvailableCell() {
    const cells = this.availableCells();
    return cells[Math.floor(Math.random() * cells.length)];
  }

  availableCells() {
    const cells = [];
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (!this.cellContent({ x, y })) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }

  cellContent(cell) {
    return this.cells[cell.x]?.[cell.y];
  }

  withinBounds(cell) {
    return (
      cell.x >= 0 &&
      cell.x < this.size &&
      cell.y >= 0 &&
      cell.y < this.size
    );
  }

  insertTile(tile) {
    this.cells[tile.x][tile.y] = tile;
  }

  removeTile(tile) {
    this.cells[tile.x][tile.y] = null;
  }

  serialize() {
    return this.cells.map((row) => row.map((cell) => (cell ? cell.serialize() : null)));
  }

  resetTilePositions() {
    this.cells.forEach((row) => row.forEach((cell) => (cell && cell.savePosition())));
  }

  moveTileTo(tile, cell) {
    this.removeTile(tile);
    this.cells[cell.x][cell.y] = tile;
    tile.updatePosition(cell);
  }
}

/**
 * Tile class representing a single tile on the game board
 */
class Tile {
  constructor(position, value) {
    this.position = position;
    this.value = value;
    this.mergedFrom = null;
  }

  savePosition() {
    this.previousPosition = { x: this.position.x, y: this.position.y };
  }

  updatePosition(position) {
    this.position = position;
  }

  is2048() {
    return this.value === 2048;
  }

  serialize() {
    return { x: this.position.x, y: this.position.y, value: this.value };
  }

  move(direction) {
    const vector = GAME_MANAGER.getVector(direction);
    const nextPosition = GAME_MANAGER.getNextPosition(this.position, vector);

    if (GAME_MANAGER.grid.withinBounds(nextPosition)) {
      GAME_MANAGER.grid.moveTileTo(this, nextPosition);
    }
  }
}

/**
 * GameManager class representing the game logic
 */
class GameManager {
  constructor(size, inputManager, actuator) {
    this.size = size;
    this.inputManager = inputManager;
    this.actuator = actuator;

    this.startTiles = 2;

    this.inputManager.on("move", this.move.bind(this));
    this.inputManager.on("restart", this.restart.bind(this));
    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

    this.setup();
  }

  restart() {
    this.storageManager.clearGameState();
    this.actuator.continueGame(); // Clear the game won/lost message
    this.setup();
  }

  keepPlaying() {
    this.keepPlaying = true;
    this.actuator.continueGame(); // Clear the game won/lost message
  }

  isGameTerminated() {
    return this.over || (this.won && !this.keepPlaying);
  }

  setup() {
    const previousState = this.storageManager.getGameState();

    if (previousState) {
      this.grid = new Grid(previousState.grid.size);
      this.grid.cells = previousState.grid.cells.map((row) =>
        row.map((cell) => (cell ? new Tile(cell, cell.value) : null))
      );
      this.score = previousState.score;
      this.over = previousState.over;
      this.won = previousState.won;
      this.keepPlaying = previousState.keepPlaying;
    } else {
      this.grid = new Grid(this.size);
      this.score = 0;
      this.over = false;
      this.won = false;
      this.keepPlaying = false;

      this.addStartTiles();
    }

    this.actuate();
  }

  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  addRandomTile() {
    if (this.grid.cellsAvailable()) {
      const value = Math.random() < 0.9 ? 2 : 4;
      const tile = new Tile(this.grid.randomAvailableCell(), value);

      this.grid.insertTile(tile);
    }
  }

  actuate() {
    if (this.storageManager.getBestScore() < this.score) {
      this.storageManager.setBestScore(this.score);
    }

    if (this.over) {
      this.storageManager.clearGameState();
    } else {
      this.storageManager.setGameState(this.serialize());
    }

    this.actuator.actuate(
      this.grid,
      {
        score: this.score,
        over: this.over,
        won: this.won,
        bestScore: this.storageManager.getBestScore(),
        terminated: this.isGameTerminated(),
      },
      this.serialize()
    );
  }

  serialize() {
    return {
      grid: this.grid.serialize(),
      score: this.score,
      over: this.over,
      won: this.won,
      keepPlaying: this.keepPlaying,
    };
  }

  resetTilePositions() {
    this.grid.resetTilePositions();
  }

  moveTileIfAvailable(tile, direction) {
    const vector = this.getVector(direction);
    const nextPosition = this.getNextPosition(tile.position, vector);

    if (this.grid.withinBounds(nextPosition)) {
      const nextTile = this.grid.cellContent(nextPosition);

      if (!nextTile) {
        this.moveTile(tile, nextPosition);
        return true;
      } else if (nextTile.value === tile.value && !nextTile.mergedFrom) {
        this.mergeTiles(tile, nextTile);
        return true;
      }
    }

    return false;
  }

  moveTile(tile, cell) {
    this.grid.moveTileTo(tile, cell);
  }

  mergeTiles(tile1, tile2) {
    const merged = new Tile({ x: tile1.position.x, y: tile1.position.y }, tile1.value * 2);
    merged.mergedFrom = [tile1, tile2];

    this.grid.insertTile(merged);
    this.grid.removeTile(tile1);
    this.grid.removeTile(tile2);

    tile1.updatePosition(tile2.position);

    this.score += merged.value;

    if (merged.value === 2048) this.won = true;
  }

  getVector(direction) {
    const map = {
      0: { x: 0, y: -1 }, // Up
      1: { x: 1, y: 0 },  // Right
      2: { x: 0, y: 1 },  // Down
      3: { x: -1, y: 0 }, // Left
    };

    return map[direction];
  }

  getNextPosition(cell, vector) {
    let previous = cell;

    // Progress towards the vector direction until an obstacle is found
    do {
      previous = { x: previous.x + vector.x, y: previous.y + vector.y };
    } while (this.grid.withinBounds(previous) && this.grid.cellAvailable(previous));

    return previous;
  }

  move(direction) {
    if (this.isGameTerminated()) return; // Don't do anything if the game's over

    const vector = this.getVector(direction);

    this.resetTilePositions();

    let moved = false;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const tile = this.grid.cellContent({ x, y });

        if (tile) {
          moved = moved || this.moveTileIfAvailable(tile, direction);
        }
      }
    }

    if (moved) {
      this.addRandomTile();

      if (!this.movesAvailable()) {
        this.over = true; // Game over!
      }

      this.actuate();
    }
  }

  movesAvailable() {
    return (
      this.grid.cellsAvailable() || this.tileMatchesAvailable()
    );
  }

  tileMatchesAvailable() {
    const self = this;

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const tile = this.grid.cellContent({ x, y });

        if (tile) {
          for (let direction = 0; direction < 4; direction++) {
            const vector = self.getVector(direction);
            const cell = { x: x + vector.x, y: y + vector.y };

            const other = self.grid.cellContent(cell);

            if (other && other.value === tile.value) {
              return true; // These two tiles can be merged
            }
          }
        }
      }
    }

    return false;
  }
}
