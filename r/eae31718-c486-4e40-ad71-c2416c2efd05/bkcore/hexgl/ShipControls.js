/*
 * HexGL
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * @license This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *          To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/3.0/.
 */

const bkcore = bkcore || {};
bkcore.hexgl = bkcore.hexgl || {};

bkcore.hexgl.ShipControls = (ctx) => {
  const self = {};
  const domElement = ctx.document;

  const initProperties = () => {
    self.active = true;
    self.destroyed = false;
    self.falling = false;

    self.dom = domElement;
    self.mesh = null;

    // ... other properties
  };

  const initControllers = () => {
    if (ctx.controlType === 1 && bkcore.controllers.TouchController.isCompatible()) {
      self.touchController = new bkcore.controllers.TouchController(
        domElement,
        ctx.width / 2,
        (state, touch, event) => {
          // ... controller logic
        }
      );
    }

    // ... other controllers
  };

  const initLeapController = () => {
    if (ctx.controlType === 2) {
      // ... leap controller logic
    }
  };

  const onKeyDown = (event) => {
    // ... keydown logic
  };

  const onKeyUp = (event) => {
    // ... keyup logic
  };

  const control = (threeMesh) => {
    self.mesh = threeMesh;
    self.mesh.matrixAutoUpdate = false;
    self.dummy.position = self.mesh.position;
  };

  const reset = (position, rotation) => {
    // ... reset logic
  };

  const terminate = () => {
    self.destroy();

    if (self.leapController != null) {
      self.leapController.disconnect();
      self.leapInfo.style.display = 'none';
    }
  };

  const destroy = () => {
    // ... destroy logic
  };

  const fall = () => {
    // ... fall logic
  };

  const update = (dt) => {
    // ... update logic
  };

  const teleport = (pos, quat) => {
    // ... teleport logic
  };

  const boosterCheck = (dt) => {
    // ... boosterCheck logic
  };

  const collisionCheck = (dt) => {
    // ... collisionCheck logic
  };

  const heightCheck = (dt) => {
    // ... heightCheck logic
  };

  const getRealSpeed = (scale) => {
    // ... getRealSpeed logic
  };

  const getRealSpeedRatio = () => {
    // ... getRealSpeedRatio logic
  };

  const getSpeedRatio = () => {
    // ... getSpeedRatio logic
  };

  const getBoostRatio = () => {
    // ... getBoostRatio logic
  };

  const getShieldRatio = () => {
    // ... getShieldRatio logic
  };

  const getShield = (scale) => {
    // ... getShield logic
  };

  const getPosition = () => {
    // ... getPosition logic
  };

  const getQuaternion = () => {
    // ... getQuaternion logic
  };

  initProperties();
  initControllers();
  initLeapController();

  domElement.addEventListener('keydown', onKeyDown, false);
  domElement.addEventListener('keyup', onKeyUp, false);

  return {
    control,
    reset,
    terminate,
    destroy,
    fall,
    update,
    teleport,
    boosterCheck,
    collisionCheck,
    heightCheck,
    getRealSpeed,
    getRealSpeedRatio,
    getSpeedRatio,
    getBoostRatio,
    getShieldRatio,
    getShield,
    getPosition,
    getQuaternion,
  };
};
