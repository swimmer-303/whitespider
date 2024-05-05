/**
 * Color correction shader
 *
 * @author alteredq / http://alteredqualia.com/
 */

const ColorCorrectionShader = {
  name: 'ColorCorrectionShader',

  uniforms: {
    tDiffuse: { value: null },
    powRGB: { value: new THREE.Vector3(2, 2, 2) },
    mulRGB: { value: new THREE.Vector3(1, 1, 1) },
    addRGB: { value: new THREE.Vector3(0, 0, 0) },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec3 powRGB;
    uniform vec3 mulRGB;
    uniform vec3 addRGB;

    varying vec2 vUv;

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      color = mulRGB * pow(color + addRGB, powRGB);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

