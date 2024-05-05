arcade.minesweeper.SSD = function(container, starting_value) {
  if (!$.createElement) {
    throw new Error('createElement function not defined');
  }

  var div = $.createElement("div").style({
    width: "39px",
    height: "23px",
    backgroundImage: "url('image/sprite.png')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-46px -81px",
    padding: "1px",
    margin: "auto"
  });

  var table = $.createElement("table").setAttribute({
    cellSpacing: 0,
    cellPadding: 0
  });

  var tbody = $.createElement("tbody");

  var tr = $.createElement("tr");

  this.ssdDigits = [];

  for (var i = 0; i < 3; i++) {
    var ssdDigit = new arcade.minesweeper.SSDDigit();
    this.ssdDigits.push(ssdDigit);
    var td = $.createElement("td");
    td.appendChild(ssdDigit.getElement());
    tr.appendChild(td);
  }

  tbody.appendChild(tr);
  table.appendChild(tbody);
  div.appendChild(table);
  container.appendChild(div);

  this.setValue(starting_value);
};

arcade.minesweeper.SSD.prototype.setValue = function(value) {
  value = Math.min(value, 999);
  this.value = value;

  if (value < 0) {
    value = Math.abs(value);
    var valueString = value + "";
    this.ssdDigits[0].set_state("-");
    this.ssdDigits[1].set_state(valueString[valueString.length - 2]);
    this.ssdDigits[2].set_state(valueString[valueString.length - 1]);
  } else {
    var valueString = value + "";
    if (valueString.length === 1) valueString = "00" + valueString;
    if (valueString.length === 2) valueString = "0" + valueString;
    this.ssdDigits[0].set_state(valueString[0]);
    this.ssdDigits[1].set_state(valueString[1]);
    this.ssdDigits[2].set_state(valueString[2]);
  }
};

arcade.minesweeper.SSD.prototype.increment = function() {
  this.setValue(this.value + 1);
};

arcade.minesweeper.SSD.prototype.decrement = function() {
  this.setValue(this.value - 1);
};

arcade.minesweeper.SSDDigit = function() {};

arcade.minesweeper.SSD.prototype.getElement = function() {
  if (!this.element) {
    this.element = $.createElement("div").style({
      width: "13px",
      height: "23px",
      backgroundImage: "url('image/sprite.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "0px -32px"
    });
  }
  return this.element;
};

arcade.minesweeper.SSDDigit.prototype.set_state = function(state) {
  switch (state) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      this.element.style({
        backgroundPosition: "-" + state * 13 + "px -32px"
      });
      break;
    case "-":
      this.element.style({
        backgroundPosition: "-130px -32px"
      });
      break;
  }
};
