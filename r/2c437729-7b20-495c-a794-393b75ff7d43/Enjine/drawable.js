/**
 * Base class for all drawable objects, makes ordering automatic.
 * Code by Rob Kleffner, 2011.
 */

class Drawable {
  constructor() {
    this.ZOrder = 0;
  }

  draw(context) {}
}
