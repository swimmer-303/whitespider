/**
 * GamepadController (Orientation + buttons) for touch devices
 * @class bkcore.GamepadController
 * @author Mahesh Kulkarni <http://twitter.com/maheshkk>
 */
class GamepadController {

  /**
   * Checks if the Gamepad API is supported by the browser
   * @return {boolean}
   * @public
   */
  static isCompatible() {
    return ('getGamepads' in navigator) || ('webkitGetGamepads' in navigator);
  }

  /**
   * Creates a new GamepadController
   * @param {Function} buttonPressCallback - Callback function to be called when a button is pressed
   * @constructor
   */
  constructor(buttonPressCallback = console.log) {
    this.active = true;
    this.leftStickArray = [];
    this.rightStickArray = [];
    this.buttonPressCallback = buttonPressCallback;
  }

  /**
   * Checks if a gamepad is currently connected
   * @return {boolean}
   * @public
   */
  isGamepadConnected() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads();
    return !!gamepads && !!gamepads[0];
  }

  /**
   * Updates the gamepad state and calls the button press callback if a button is pressed
   * @return {boolean}
   * @public
   */
  updateAvailable() {
    if (!this.active) {
      return false;
    }

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads();
    if (!gamepads || !gamepads[0]) {
      return false;
    }

    const gp = gamepads[0];
    if (!gp.buttons || !gp.axes) {
      return false;
    }

    this.lstickx = gp.axes[0];
    const accel = gp.buttons[0];
    const lt = gp.buttons[6];
    const rt = gp.buttons[7];
    const sel = gp.buttons[8];

    // API fallback
    this.acceleration = accel.pressed ? accel : null;
    this.ltrigger = lt.pressed ? lt : null;
    this.rtrigger = rt.pressed ? rt : null;
    this.select = sel.pressed ? sel : null;

    this.buttonPressCallback(this);
    return true;
  }

  /**
   * Gets the current gamepad state
   * @return {Object}
   * @public
   */
  getGamepadState() {
    return {
      lstickx: this.lstickx,
      acceleration: this.acceleration,
      ltrigger: this.ltrigger,
      rtrigger: this.rtrigger,
      select: this.select,
    };
  }

  /**
   * Disconnects the gamepad
   * @public
   */
  disconnect() {
    this.active = false;
  }

}

if (typeof exports !== 'undefined') {
  if (exports.bkcore) {
    if (exports.bkcore.controllers) {
      exports.bkcore.controllers.GamepadController = GamepadController;
    } else {
      exports.bkcore.controllers = {
        GamepadController,
      };
    }
  } else {
    exports.bkcore = {
      controllers: {
        GamepadController,
      },
    };
  }
}
