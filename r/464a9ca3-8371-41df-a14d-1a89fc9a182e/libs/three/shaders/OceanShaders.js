// Author: Aleksandr Albert
// Website: www.routter.co.tt

// Shader set for a deep water ocean simulation

// Constants
const G = 9.81;
const KM = 370.0;
const CM = 0.23;
const TWO_PI = 2.0 * Math.PI;
const HALF_PI = 0.5 * Math.PI;
const LOG_2 = Math.log(2.0);
const LOG_10 = Math.log(10.0);
const SQRT_2 = Math.SQRT2;
const SQRT_10 = Math.SQRT10;
const EPSILON = 0.00001;

// Ocean simulation shaders
THREE.OceanShaders = {};

THREE.OceanShaders[ "ocean_sim_vertex" ] = {
  vertexShader: `
    varying vec2 vUV;

    void main (void) {
      vUV = position.xy * 0.5 + 0.5;
      gl_Position = vec4(position, 1.0 );
    }
  `
};

THREE.OceanShaders[ "ocean_subtransform" ] = {
  uniforms: {
    "u_input": { value: null },
    "u_transformSize": { value: 512.0 },
    "u_subtransformSize": { value: 250.0 }
  },
  fragmentShader: `
    // GPU FFT using a Stockham formulation

    precision highp float;
    #include <common>

    uniform sampler2D u_input;
    uniform float u_transformSize;
    uniform float u_subtransformSize;

    varying vec2 vUV;

    vec2 multiplyComplex (vec2 a, vec2 b) {
      return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);
    }

    void main (void) {
      #ifdef HORIZONTAL
      float index = vUV.x * u_transformSize - 
