/**
 * A horizontal and vertical blur filter by Mat Groves (http://matgroves.com/) and Hiroki Nishina.
 */
class BlurFilter extends Phaser.Filter {
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
      "  vec4 sum = vec4(0.0);",
      "  for (float i = -4.0; i <= 4.0; i++) {",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y - 4.0 * blur)) * 0.05;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y - 3.0 * blur)) * 0.09;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y - 2.0 * blur)) * 0.12;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y - blur)) * 0.15;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y)) * 0.16;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y + blur)) * 0.15;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y + 2.0 * blur)) * 0.12;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y + 3.0 * blur)) * 0.09;",
      "    sum += texture2D(uSampler, vec2(vTextureCoord.x + i * blur, vTextureCoord.y + 4.0 * blur)) * 0.05;",
      "  }",
      "  gl_FragColor = sum;",
      "}"
    ].join('\n');
  }

  get blur() {
    return this.uniforms.blur.value * (1 / 512);
  }

  set blur(value) {
    if (value < 0) {
      console.error('Blur value should be non-negative.');
      return;
    }
    this.uniforms.blur.value = value * 512;
    this.dirty = true;
  }
}

Object.assign(BlurFilter.prototype, Phaser.Filter.prototype);
BlurFilter.prototype.constructor = BlurFilter;
