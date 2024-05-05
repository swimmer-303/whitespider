/**
  Loads an image and gives access to pixel data.

  @class bkcore.ImageData
  @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
*/
class ImageData {

  /**
    Creates a new ImageData object

    @param {string} path The path of the image
    @param {function} callback A callback function to be called
      once the image is loaded
  */
  constructor(path, callback) {

    this.image = new Image;
    this.pixels = null;
    this.canvas = null;
    this.loaded = false;

    this.image.onload = () => {

      this.canvas = document.createElement('canvas');
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;

      const context = this.canvas.getContext('2d');
      context.drawImage(this.image, 0, 0);

      this.pixels = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      this.loaded = true;

      context = null;
      this.image = null;

      callback?.call(this);
    }

    this.image.crossOrigin = "anonymous";
    this.image.src = path;
  }

  /**
    Gets pixel RGBA data at given index

    @param {number} x In pixels
    @param {number} y In pixels
    @return {Object{r,g,b,a}}
  */
  getPixel(x, y) {

    if (!this.pixels || x < 0 || y < 0 || x >= this.pixels.width || y >= this.pixels.height) {
      return { r: 0, g: 0, b: 0, a: 0 };
    }

    const i = (y * this.pixels.width + x) * 4;

    return {
      r: this.pixels.data[i],
      g: this.pixels.data[i + 1],
      b: this.pixels.data[i + 2],
      a: this.pixels.data[i + 3]
    };
  }

  /**
    Gets pixel RGBA data at given float index using bilinear interpolation

    @param {number} fx In subpixels
    @param {number} fy In subpixels
    @return {Object{r,g,b,a}}
  */
  getPixelBilinear(fx, fy) {

    const x = Math.floor(fx);
    const y = Math.floor(fy);
    const rx = fx - x - .5;
    const ry = fy - y - .5;
    const ax = Math.abs(rx);
    const ay = Math.abs(ry);
    const dx = rx < 0 ? -1 : 1;
    const dy = ry < 0 ? -1 : 1;

    if (!this.pixels || x < 0 || y < 0 || x >= this.pixels.width || y >= this.pixels.height) {
      return { r: 0, g: 0, b: 0, a: 0 };
    }

    const c = this.getPixel(x, y);
    const cx = this.getPixel(x + dx, y);
    const cy = this.getPixel(x, y + dy);
    const cxy = this.getPixel(x + dx, y + dy);

    const cf1 = [
      (1 - ax) * c.r + ax * cx.r,
      (1 - ax) * c.g + ax * cx.g,
      (1 - ax) * c.b + ax * cx.b,
      (1 - ax) * c.a + ax * cx.a
    ];

    const cf2 = [
      (1 - ax) * cy.r + ax * cxy.r,
      (1 - ax) * cy.g + ax * cxy.g,
      (1 - ax) * cy.b + ax * cxy.b,
      (1 - ax) * cy.a + ax * cxy.a
    ];

    return {
      r: (1 - ay) * cf1[0] + ay * cf2[0],
      g: (1 - ay) * cf1[1] + ay * cf2[1],
      b: (1 - ay) * cf1[2] + ay * cf2[2],
      a: (1 - ay) * cf1[3] + ay * cf2[3]
    };
  }

  /**
    Gets pixel data at given index
    as 3-bytes integer (for floating-point textures erzats, from RGB values)

    @param {number} x In pixels
    @param {number} y In pixels
    @return {number} (R + G*255 + B*255*255)
  */
  getPixelF(x, y) {

    const c = this.getPixel(x, y);
    return c.r + c.g * 255 + c.b * 255 * 255;
  }

  /**
    Gets pixel data at given float index using bilinear interpolation
    as 3-bytes integer (for floating-point textures erzats, from RGB values)

    @param {number} fx In subpixels
    @param {number} fy In subpixels
    @return {number} (R + G*255 + B*255*255)
  */
  getPixelFBilinear(fx, fy) {

    const c = this.getPixelBilinear(fx, fy);
    return c.r + c.g * 255 + c.b * 255 * 255;
  }
}

/**
  Exports
  @package bkcore
*/
const exports = exports || {};
exports.bkcore = exports.bkcore || {};
exports.bkcore.ImageData = ImageData;
