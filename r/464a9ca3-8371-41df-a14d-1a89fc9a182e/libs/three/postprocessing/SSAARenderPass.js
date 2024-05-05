/**
 * Supersample Anti-Aliasing Render Pass
 * @author bhouston / http://clara.io/
 * This manual approach to SSAA re-renders the scene once for each sample with camera jitter and accumulates the results.
 * References: https://en.wikipedia.org/wiki/Supersampling
 */

THREE.SSAARenderPass = function (scene, camera, clearColor, clearAlpha) {
  THREE.Pass.call(this);

  this.scene = scene || null;
  this.camera = camera || null;

  this.sampleLevel = 4; // specified as n, where the number of samples is 2^n, so sampleLevel = 4, is 2^4 samples, 16.
  this.unbiased = true;

  this.clearColor = clearColor !== undefined ? clearColor : 0x000000;
  this.clearAlpha = clearAlpha !== undefined ? clearAlpha : 0;

  if (THREE.CopyShader === undefined) console.error("THREE.SSAARenderPass relies on THREE.CopyShader");

  const copyShader = THREE.CopyShader;
  this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms);

  this.copyMaterial = new THREE.ShaderMaterial({
    uniforms: this.copyUniforms,
    vertexShader: copyShader.vertexShader,
    fragmentShader: copyShader.fragmentShader,
    premultipliedAlpha: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });

  this.fsQuad = new THREE.Pass.FullScreenQuad(this.copyMaterial);
};

THREE.SSAARenderPass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {
  constructor: THREE.SSAARenderPass,

  dispose: function () {
    if (this.sampleRenderTarget) {
      this.sampleRenderTarget.dispose();
      this.sampleRenderTarget = null;
    }
  },

  setSize: function (width, height) {
    if (this.sampleRenderTarget) this.sampleRenderTarget.setSize(width, height);
  },

  render: function (renderer, writeBuffer, readBuffer) {
    if (!this.sampleRenderTarget) {
      this.sampleRenderTarget = new THREE.WebGLRenderTarget(
        readBuffer.width,
        readBuffer.height,
        {
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          format: THREE.RGBAFormat,
        }
      );
      this.sampleRenderTarget.texture.name = "SSAARenderPass.sample";
    }

    const jitterOffsets =
      THREE.SSAARenderPass.JitterVectors[
        Math.max(0, Math.min(this.sampleLevel, 5))
      ];

    const autoClear = renderer.autoClear;
    renderer.autoClear = false;

    const oldClearColor = renderer.getClearColor().getHex();
    const oldClearAlpha = renderer.getClearAlpha();

    const baseSampleWeight = 1.0 / jitterOffsets.length;
    const roundingRange = 1 / 32;
    this.copyUniforms["tDiffuse"].value = this.sampleRenderTarget.texture;

    const width = readBuffer.width;
    const height = readBuffer.height;

    for (let i = 0; i < jitterOffsets.length; i++) {
      const jitterOffset = jitterOffsets[i];

      if (this.camera.setViewOffset) {
        this.camera.setViewOffset(
          width,
          height,
          jitterOffset[0] * 0.0625,
          jitterOffset[1] * 0.0625, // 0.0625 = 1 / 16
          width,
          height
        );
      }

      let sampleWeight = baseSampleWeight;

      if (this.unbiased) {
        // the theory is that equal weights for each sample lead to an accumulation of rounding errors.
        // The following equation varies the sampleWeight per sample so that it is uniformly distributed
        // across a range of values whose rounding errors cancel each other out.

        const uniformCenteredDistribution =
          -0.5 + (i + 0.5) / jitterOffsets.length;
        sampleWeight += roundingRange * uniformCenteredDistribution;
      }

      this.copyUniforms["opacity"].value = sampleWeight;
      renderer.setClearColor(this.clearColor, this.clearAlpha);
      renderer.setRenderTarget(this.sampleRenderTarget);
      renderer.clear();
      renderer.render(this.scene, this.camera);

      renderer.setRenderTarget(
        this.renderToScreen ? null : writeBuffer
