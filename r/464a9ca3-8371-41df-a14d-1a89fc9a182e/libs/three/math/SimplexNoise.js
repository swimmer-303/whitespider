// Ported from Stefan Gustavson's java implementation
// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// Read Stefan's excellent paper for details on how this code works.
//
// Sean McCullough banksean@gmail.com
//
// Added 4D noise
// Joshua Koo zz85nus@gmail.com

class SimplexNoise {
  constructor(r) {
    if (r === undefined) r = Math;

    this.grad3 = [
      [1, 1, 0],
      [-1, 1, 0],
      [1, -1, 
