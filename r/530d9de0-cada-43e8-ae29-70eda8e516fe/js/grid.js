/**
 * Represents a grid of tiles.
 * @constructor
 * @param {number} size - The size of the grid (number of cells on each side).
 * @param {Array<Array<Tile|null>>} [previousState] - The initial state of the grid.
 */
function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  const cells = [];

  for (let x = 0; x < this.size; x++) {
    const row = cells[x] = [];

    for (let y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  const cells = [];

  for (let x = 0; x < this.size; x++) {
    const row = cells[x] = [];

    for (let y = 0; y < this.size; y++) {
      const tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.value) : null);
    }
  }

  return cells;
};

/**
 * Find the first available random position
 * @returns {null|{x: number, y: number}} A random available cell, or null if no cells are available.
 */
Grid.prototype.randomAvailableCell = function () {
  const cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }

  return null;
};

/**
 * Find the first available random position, but with the cells array shuffled first
 * to avoid always selecting the same cell when there are multiple available cells
 * @returns {null|{x: number, y: number}} A random available cell, or null if no cells are available.
 */
Grid.prototype.randomAvailableCellShuffled = function () {
  const cells = this.availableCells();

  if (cells.length) {
    this.shuffle(cells);
    return cells[0];
  }

  return null;
};

/**
 * Shuffle an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 */
Grid.prototype.shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

Grid.prototype.availableCells = function () {
  const cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

/**
 * Call callback for every cell
 * @param {function} callback - The callback function to call for each cell
 */
Grid.prototype.eachCell = function (callback) {
  for (let x = 0; x < this.size; x++) {
    for (let y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

/**
 * Check if there are any cells available
 * @returns {boolean} True if there are available cells, false otherwise
 */
Grid.prototype.cellsAvailable = function () {
  return this.availableCells().length > 0;
};

/**
 * Check if the specified cell is taken
 * @param {Object} cell - The cell to check
 * @returns {boolean} True if the cell is taken, false otherwise
 */
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

/**
 * Get the content of the specified cell
 * @param {Object} cell - The cell to get the content of
 * @returns {Tile|null} The tile at the specified cell, or null if the cell is empty
 */
Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  }

  return null;
};

/**
 * Insert a tile at its position
 * @param {Tile} tile - The tile to insert
 */
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

/**
 * Check if the specified position is within the bounds of the grid
 * @param {Object} position - The position to check
 * @returns {boolean} True if the position is within the bounds of the grid, false otherwise
 */
Grid.prototype.withinBounds = function (position) {
  return (
    position.x >= 0 &&
    position.x < this.size &&
    position.y >= 0 &&
    position.y < this.size
  );
};

/**
 * Create a deep copy of the grid
 * @returns {Grid} A deep copy of the grid
 */
Grid.prototype.clone = function () {
  return new Grid(this.size, this.serialize());
};

Grid.prototype.serialize = function () {
  const cellState = [];

  for (let x = 0; x < this.size; x++) {
    const row = cellState[x] = [];

    for (let y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState,
  };
};
