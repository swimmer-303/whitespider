/**
 * @author Thibaut Despoulain / http://bkcore.com
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

const bkcore = bkcore || {};
bkcore.threejs = bkcore.threejs || {};

bkcore.threejs.Shaders = {
  sharedVertexShader: `
    varying vec2 vUv;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vViewPosition = cameraPosition - objectMatrix * vec4(position, 1.0).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  additive: {
    uniforms: {
      tDiffuse: { type: "t", value: 0, texture: null },
      tAdd: { type: "t", value: 1, texture: null },
      fCoeff: { type: "f", value: 1.0 }
    },
    vertexShader: bkcore.threejs.Shaders.sharedVertexShader,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform sampler2D tAdd;
      uniform float fCoeff;

      varying vec2 vUv;
      varying vec3 vViewPosition;

      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec4 add = texture2D(tAdd, vUv);
        gl_FragColor = texel + add * fCoeff * add.a;
      }
    `
  },

  // ... rest of the shaders

};
