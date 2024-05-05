/*
  GamepadController (Orientation + buttons) for touch devices

  @class bkcore.GamepadController
  @author Mahesh Kulkarni <http://twitter.com/maheshkk>
*/

class GamepadController {
  static isCompatible() {
    return ('getGamepads' in navigator) || ('webkitGetGamepads' in navigator);
  }

  /*
    Creates a new GamepadController

    @param {Function} buttonPressCallback - Callback function to be called when a button is pressed.
  */
  constructor(buttonPressCallback) {
    if (typeof buttonPressCallback !== 'function') {
      throw new Error('buttonPressCallback must be a function');
    }

    this.buttonPressCallback = buttonPressCallback;
    this.active = true;
    this.leftStickArray = [];
    this.rightStickArray = [];
  }

  /*
    Updates the availability of the gamepad.

    @returns {Boolean} True if the gamepad is available, false otherwise.
  */
  updateAvailable() {
    let gamepads, gp, accel, lt, rt, sel;

    if (!this.active) {
      return false;
    }

    gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads();

    if (!gamepads || !gamepads[0]) {
      return false;
    }

    gp = gamepads[0];

    if (!gp.buttons || !gp.axes) {
      return;
    }

    this.lstickx = gp.axes[0];

    if (gp.buttons.length > 0) {
      accel = gp.buttons[0];
      lt = gp.buttons[6];
      rt = gp.buttons[7];
      sel = gp.buttons[8];

      this.acceleration = accel.pressed || accel;
      this.ltrigger = lt.pressed || lt;
      this.rtrigger = rt.pressed || rt;
      this.select = sel.pressed || sel;
    }

    this.buttonPressCallback(this);

    return true;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports.bkcore = module.exports.bkcore || {};
  module.exports.bkcore.controllers = module.exports.bkcore.controllers || {};
  module.exports.bkcore.controllers.GamepadController = GamepadController;
}
