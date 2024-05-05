class OrientationController {
  constructor(dom, registerTouch = true, touchCallback = null) {
    this.active = true;
    this.alpha = 0.0;
    this.beta = 0.0;
    this.gamma = 0.0;
    this.dalpha = null;
    this.dbeta = null;
    this.dgamma = null;
    this.touches = null;
    this.gammaSign = 1;

    if (this.isCompatible()) {
      window.addEventListener('deviceorientation', (e) => this.orientationChange(e), false);
    }

    if (registerTouch) {
      dom.addEventListener('touchstart', (e) => this.touchStart(e), false);
      dom.addEventListener('touchend', (e) => this.touchEnd(e), false);
    }

    this.lockOrientation = this.lockOrientation.bind(this);
    this.dispose = this.dispose.bind(this);
  }

  isCompatible() {
    return 'DeviceOrientationEvent' in window;
  }

  orientationChange(event) {
    if (!this.active) return;

    if (this.dalpha === null) {
      this.dalpha = event.alpha;
      this.dbeta = event.beta;
      this.dgamma = event.gamma;

      if (event.gamma < 0) {
        this.gammaSign = -1;
      } else {
        this.gammaSign = 1;
      }
    }

    this.alpha = event.alpha - this.dalpha;
    this.beta = event.beta - this.dbeta;
    this.gamma = this.gammaSign * (event.gamma - this.dgamma);
  }

  touchStart(event) {
    if (!this.active) return;

    if (event.changedTouches.length > 0) {
      for (let touch of event.changedTouches) {
        this.touchCallback(true, touch, event);
      }
    }

    this.touches = event.touches;
  }

  touchEnd(event) {
    if (!this.active) return;

    if (event.changedTouches.length > 0) {
      for (let touch of event.changedTouches) {
        this.touchCallback(false, touch, event);
      }
    }

    this.touches = event.touches;
  }

  lockOrientation() {
    if (screen.orientation.lock) {
      screen.orientation.lock('portrait');
    } else {
      console.warn('Screen.orientation.lock not supported');
    }
  }

  dispose() {
    if (this.isCompatible()) {
      window.removeEventListener('deviceorientation', (e) => this.orientationChange(e), false);
    }

    this.dom.removeEventListener('touchstart', (e) => this.touchStart(e), false);
    this.dom.removeEventListener('touchend', (e) => this.touchEnd(e), false);

    this.active = false;
    this.alpha = 0.0;
    this.beta = 0.0;
    this.gamma = 0.0;
    this.dalpha = null;
    this.dbeta = null;
    this.dgamma = null;
    this.touches = null;
    this.gammaSign = 1;
  }
}

module.exports = OrientationController;
