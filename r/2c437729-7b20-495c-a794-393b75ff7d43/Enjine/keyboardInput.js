/**
 * Class that helps to manage keyboard input.
 * Code by Rob Kleffner, 2011
 */

Enjine.Keys = {
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

Enjine.KeyboardInput = {
    pressed: [],

    initialize: function () {
        var self = this;
        document.addEventListener('keydown', function (event) { self.keyDownEvent(event); });
        document.addEventListener('keyup', function (event) { self.keyUpEvent(event); });
    },

    isKeyDown: function (key) {
        return this.pressed[key] !== undefined ? this.pressed[key] : false;
    },

    keyDownEvent: function (event) {
        this.pressed[event.keyCode] = true;
        this.preventScrolling(event);
    },

    keyUpEvent: function (event) {
        this.pressed[event.keyCode] = false;
        this.preventScrolling(event);
    },

    preventScrolling: function (event) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();
        }
    }
};
