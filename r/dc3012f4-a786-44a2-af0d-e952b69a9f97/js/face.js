arcade.minesweeper.face = function(minesweeper, container) {
  this.minesweeper = minesweeper;
  this.element = this.get_element();
  container.appendChild(this.element);
  return this;
}

arcade.minesweeper.face.prototype.state;
arcade.minesweeper.face.prototype.mouse_left = 1;
arcade.minesweeper.face.prototype.mouse_right = 3;

arcade.minesweeper.face.prototype.get_element = function() {
  var self = this;
  this.element = document.createElement("div");
  this.element.style.width = "26px";
  this.element.style.height = "26px";
  this.element.style.margin = "auto";
  this.element.style.backgroundImage = "url('image/sprite.png')";
  this.element.style.backgroundRepeat = "no-repeat";
  this.element.addEventListener("mousedown", function(e) {
    e.preventDefault();
    if (self.state === "smile") self.set_state("depressed_smile");
  });
  this.element.addEventListener("mouseup", function(e) {
    if (self.state === "depressed_smile") {
      self.set_state("smile");
      self.minesweeper.restart();
    }
  });
  this.element.addEventListener("mouseout", function() {
    if (self.state === "depressed_smile") self.set_state("smile");
  });
  this.element.addEventListener("mouseover", function(e) {
    if (e.which === self.mouse_left && self.state === "smile") self.set_state("depressed_smile");
  });
  this.set_state("smile");
  return this.element;
}

arcade.minesweeper.face.prototype.set_state = function(state) {
  this.state = state;
  switch (state) {
    case "smile":
      this.element.style.backgroundPosition = "0px -55px";
      break;
    case "depressed_smile":
      this.element.style.backgroundPosition = "-26px -55px";
      break;
    case "scared":
      this.element.style.backgroundPosition = "-52px -55px";
      break;
    case "dead":
      this.element.style.backgroundPosition = "-78px -55px";
      break;
    case "sunglasses":
      this.element.style.backgroundPosition = "-104px -55px";
      break;
  }
}

arcade.minesweeper.face.prototype.get_state = function() {
  return this.state;
}
