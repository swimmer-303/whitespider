/**
 * GlitchPass class for THREE.js
 * @author alteredq / http://alteredqualia.com/
 * @modified mrdenny / https://github.com/mrdenny
 */

import {
  Pass,
  FullScreenQuad,
  ShaderMaterial,
  UniformsUtils
} from 'three';

import vertexShader from './glitch-vertex.glsl';
import fragmentShader from './glitch-fragment.glsl';

class GlitchPass extends Pass {
  constructor(dt_size = 64) {
    super();

    if (THREE.DigitalGlitch === undefined) {
      console.error('THREE.GlitchPass relies on THREE.DigitalGlitch');
    }

    const shader = THREE.DigitalGlitch;
    this.uniforms = UniformsUtils.merge([
      shader.uniforms,
      {
        tDisp: { value: null },
        tDiffuse: { value: null },
        seed: { value: 0 },
        byp: { value: 0 },
        amount: { value: 0 },
        angle: { value: 0 },
        seed_x: { value: 0 },
        seed_y: { value: 0 },
        distortion_x: { value: 0 },
        distortion_y: { value: 0 }
      }
    ]);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader
    });

    this.fsQuad = new FullScreenQuad(this.material);

    this.goWild = false;
    this.curF = 0;
    this.randX = 0;

    this.generateTrigger();

    this.uniforms.tDisp.value = this.generateHeightmap(dt_size);
  }

  render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    this.uniforms.tDiffuse.value = readBuffer.texture;
    this.uniforms.seed.value = Math.random(); //default seeding
    this.uniforms.byp.value = 0;

    if (this.curF % this.randX === 0 || this.goWild === true) {
      this.uniforms.amount.value = Math.random() / 30;
      this.uniforms.angle.value = Math.random() * Math.PI * 2 - Math.PI;
      this.uniforms.seed_x.value = Math.random() * 2 - 1;
      this.uniforms.seed_y.value = Math.random() * 2 - 1;
      this.uniforms.distortion_x.value = Math.random();
      this.uniforms.distortion_y.value = Math.random();
      this.curF = 0;
      this.generateTrigger();
    } else if (this.curF % this.randX < this.randX / 5) {
      this.uniforms.amount.value = Math.random() / 90;
      this.uniforms.angle.value = Math.random() * Math.PI * 2 - Math.PI;
      this.uniforms.distortion_x.value = Math.random();
      this.uniforms.distortion_y.value = Math.random();
      this.uniforms.seed_x.value = Math.random() * 0.6 - 0.3;
      this.uniforms.seed_y.value = Math.random() * 0.6 - 0.3;
    } else if (this.goWild === false) {
      this.uniforms.byp.value = 1;
    }

    this.curF++;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }

  generateTrigger() {
    this.randX = Math.floor(Math.random() * 120) + 120;
  }

  generateHeightmap(dt_size) {
    const data_arr = new Float32Array(dt_size * dt_size * 3);
    const length = dt_size * dt_size;

    for (let i = 0; i < length; i++) {
      const val = Math.random();
      data_arr[i * 3 + 0] = val;
      data_arr[i * 3 + 1] = val;
      data_arr[i * 3 + 2] = val;
    }

    return new THREE.DataTexture(data_arr, dt_size, dt_size, THREE.RGBFormat, THREE.FloatType);
  }
}

export default GlitchPass;
