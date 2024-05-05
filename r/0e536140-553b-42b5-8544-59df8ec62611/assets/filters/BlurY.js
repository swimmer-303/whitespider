/**
 * A Phaser filter for applying a vertical blur effect to a sprite or game object.
 *
 * To use this filter, create a new instance of the `BlurY` class and add it to the
 * `filters` array of the game object you want to apply the blur effect to.
 *
 * Example usage:
 *
 *     const blurYFilter = new BlurY(game);
 *     sprite.filters = [blurYFilter];
 *
 * You can adjust the blur intensity by setting the `blur` property of the filter.
 *
 * Example usage:
 *
 *     blurYFilter.blur = 10;
 */
class BlurY extends Phaser.Filter {
  constructor(game) {
    super(game);

    this.uniforms.blur = { type: '1f', value: 1 / 512 };

    this.fragmentSrc = [
      "precision mediump float;",
      "varying vec2 vTextureCoord;",
      "varying vec4 vColor;",
      "uniform float blur;",
      "uniform sampler2D uSampler;",

      "void main(void) {",
        "vec4 sum = vec4(0.0);",

        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;",
        "sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;",

        "gl_FragColor = sum;",
      "}"
    ].join('\n');

    this.name = 'BlurY';
  }

  get blur() {
    return this.uniforms.blur.value * 7000;
  }

  set blur(value) {
    if (value < 0) {
      console.error('Blur value must be non-negative.');
      return;
    }

    this.uniforms.blur.value = value / 7000;
    this.dirty = true;
  }
}

BlurY.prototype = Object.create(Phaser.Filter.prototype);
BlurY.prototype.constructor = BlurY;
