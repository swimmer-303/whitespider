arcade.minesweeper.tile = function(is_a_mine) {
  this.is_a_mine_ = is_a_mine;
  this.is_revealed_ = false;
  this.element = null;
}

Object.defineProperties(arcade.minesweeper.tile.prototype, {
  is_a_mine: {
    get: function() {
      return this.is_a_mine_;
    }
  },
  is_revealed: {
    get: function() {
      return this.is_revealed_;
    }
  },
  mine_count: {
    get: function() {
      return this.mine_count;
    }
  },
  state: {
    get: function() {
      return this.state_;
    },
    set: function(value) {
      this.state_ = value;
      switch (value) {
        case "covered":
          this.element.style("background-position", "0px -16px");
          break;
        case "flag":
          this.element.style("background-position", "-48px -16px");
          break;
        case "question":
          this.element.style("background-position", "-96px -1
