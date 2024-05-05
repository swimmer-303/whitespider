/**
 * FilmPass - a postprocessing pass that applies a film grain and scanlines effect
 * @author alteredq / http://alteredqualia.com/
 */

const THREE = require('three');

const filmShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    nIntensity: { value: 1.0 },
    sIntensity: { value: 1.0 },
    sCount: { value: 100 },
    grayscale: { value: false },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float nIntensity;
    uniform float sIntensity;
    uniform float sCount;
    uniform bool grayscale;

    void main() {
      vec4 color = texture2D( tDiffuse, vUv );
      float noise = nIntensity * ( 0.5 + 0.5 * sin( time + 10.0 * vUv.x + 20.0 * vUv.y ) );
      float scanlines = sIntensity * mod( vUv.y * sCount, 1.0 );
      if ( grayscale ) {
        color.rgb = vec3( dot( color.rgb, vec3( 0.393, 0.769, 0.189 ) ) );
      }
      gl_FragColor = vec4( color.rgb + noise + scanlines, color.a );
    }
  `,
};

class FilmPass {
  constructor(noiseIntensity = 1.0, scanlinesIntensity = 1.0, scanlinesCount = 100, grayscale = false) {
    if (THREE.ShaderExtras && THREE.ShaderExtras['film']) {
      console.warn('THREE.FilmPass has been modified. Using custom implementation instead.');
    }

    this.uniforms = THREE.UniformsUtils.clone(filmShader.uniforms);

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: filmShader.vertexShader,
      fragmentShader: filmShader.fragmentShader,
    });

    this.setNoiseIntensity(noiseIntensity);
    this.setScanlinesIntensity(scanlinesIntensity);
    this.setScanlinesCount(scanlinesCount);
    this.setGrayscale(grayscale);

    this.enabled = true;
    this.renderToScreen = false;
    this.needsSwap = true;
  }

  setNoiseIntensity(value) {
    if (typeof value !== 'number') {
      console.error('FilmPass: setNoiseIntensity: value must be a number.');
      return;
    }
    this.uniforms.nIntensity.value = value;
  }

  setScanlinesIntensity(value) {
    if (typeof value !== 'number') {
      console.error('FilmPass: setScanlinesIntensity: value must be a number.');
      return;
   
