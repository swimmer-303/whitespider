/**
 * @author Mugen87 / https://github.com/Mugen87
 */

class SSAOPass extends THREE.Pass {
  constructor({ scene, camera, width = 512, height = 512 }) {
    super();

    this.width = width;
    this.height = height;

    this.clear = true;

    this.camera = camera;
    this.scene = scene;

    this.kernelRadius = 8;
    this.kernelSize = 32;
    this.kernel = [];
    this.noiseTexture = null;
    this.output = 0;

    this.minDistance = 0.005;
    this.maxDistance = 0.1;

    this.generateSampleKernel();
    this.generateRandomKernelRotations();

    // beauty render target with depth buffer
    this.createRenderTarget('beautyRenderTarget', width, height);

    // normal render target
    this.createRenderTarget('normalRenderTarget', width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat
    });

    // ssao render target
    this.createRenderTarget('ssaoRenderTarget', width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });

    this.blurRenderTarget = this.ssaoRenderTarget.clone();

    // ssao material
    if (!THREE.SSAOShader) {
      console.error('THREE.SSAOPass: The pass relies on THREE.SSAOShader.');
    }

    this.ssaoMaterial = new THREE.ShaderMaterial({
      defines: { ...THREE.SSAOShader.defines },
      uniforms: { ...THREE.SSAOShader.uniforms },
      vertexShader: THREE.SSAOShader.vertexShader,
      fragmentShader: THREE.SSAOShader.fragmentShader,
      blending: THREE.NoBlending
    });

    this.updateSSAOUniforms();

    // normal material
    this.normalMaterial = new THREE.MeshNormalMaterial();
    this.normalMaterial.blending = THREE.NoBlending;

    // blur material
    this.blurMaterial = new THREE.ShaderMaterial({
      defines: { ...THREE.SSAOBlurShader.defines },
      uniforms: { ...THREE.SSAOBlurShader.uniforms },
      vertexShader: THREE.SSAOBlurShader.vertexShader,
      fragmentShader: THREE.SSAOBlurShader.fragmentShader
    });
    this.blurMaterial.uniforms['tDiffuse'].value = this.ssaoRenderTarget.texture;
    this.blurMaterial.uniforms['resolution'].value.set(this.width, this.height);

    // material for rendering the depth
    this.depthRenderMaterial = new THREE.ShaderMaterial({
      defines: { ...THREE.SSAODepthShader.defines },
      uniforms: { ...THREE.SSAODepthShader.uniforms },
      vertexShader: THREE.SSAODepthShader.vertexShader,
      fragmentShader: THREE.SSAODepthShader.fragmentShader,
      blending: THREE.NoBlending
    });
    this.depthRenderMaterial.uniforms['tDepth'].value = this.beautyRenderTarget.depthTexture;
    this.depthRenderMaterial.uniforms['cameraNear'].value = this.camera.near;
    this.depthRenderMaterial.uniforms['cameraFar'].value = this.camera.far;

    // material for rendering the content of a render target
    this.copyMaterial = new THREE.ShaderMaterial({
      uniforms: { ...THREE.CopyShader.uniforms },
      vertexShader: THREE.CopyShader.vertexShader,
      fragmentShader: THREE.CopyShader.fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blendSrc: THREE.DstColorFactor,
      blendDst: THREE.ZeroFactor,
      blendEquation: THREE.AddEquation,
      blendSrcAlpha: THREE.DstAlphaFactor,
      blendDstAlpha: THREE.ZeroFactor,
      blendEquationAlpha: THREE.AddEquation
    });

    this.fsQuad = new THREE.Pass.FullScreenQuad(null);

    this.originalClearColor = new THREE.Color();
  }

  dispose() {
    // dispose render targets
    this.beautyRenderTarget.dispose();
    this.normalRenderTarget.dispose();
    this.ssaoRenderTarget.dispose();
    this.blurRenderTarget.dispose();

    // dispose materials
    this.normalMaterial.dispose();
    this.blurMaterial.dispose();
    this.copyMaterial.dispose();
    this.depthRenderMaterial.dispose();

    // dispose full screen quad
    this.fsQuad.dispose();
  }

  render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    // render beauty and depth
    this.renderToRenderTarget(renderer, this.scene, this.camera, this.beautyRenderTarget, this.originalClearColor, 1);

    // render normals
    this.renderOverride(renderer, this.normalMaterial, this.normalRenderTarget, 0x7777ff, 1.0);

    // render SSAO
    this.renderPass(renderer, this.ssaoMaterial, this.ssaoRenderTarget);

    // render blur
    this.renderPass(renderer, this.blurMaterial, this.blurRenderTarget);

    // output result to screen
    this.copyMaterial.uniforms['tDiffuse'].value = this.blurRenderTarget.texture;
    this.renderPass(renderer, this.copyMaterial, this.renderToScreen ? null : writeBuffer);
  }

  renderPass(renderer, passMaterial, renderTarget, clearColor, clearAlpha) {
    const originalClearColor = renderer.getClearColor();
    const originalClearAlpha = renderer.getClearAlpha();
    const originalAutoClear = renderer.autoClear;

    renderer.setRenderTarget(renderTarget);
    renderer.autoClear = false;

    if (clearColor && clearAlpha !== undefined) {
      renderer.setClearColor(clearColor);
      renderer.setClearAlpha(clearAlpha);
      renderer.clear();
    }

    this.fsQuad.material = passMaterial;
    this.fsQuad.render(renderer);

    renderer.autoClear = originalAutoClear;
    renderer.setClearColor(originalClearColor);
    renderer.setClearAlpha(originalClearAlpha);
  }

  renderOverride(renderer, overrideMaterial, renderTarget, clearColor, clearAlpha) {
    const originalClearColor = renderer.getClearColor();
    const originalClearAlpha = renderer.getClearAlpha();
    const originalAutoClear = renderer.autoClear;

    renderer.setRenderTarget(renderTarget);
    renderer.autoClear = false;

    clearColor = overrideMaterial.clearColor || clearColor;
    clearAlpha = overrideMaterial.clearAlpha || clearAlpha;

    if (clearColor && clearAlpha !== undefined) {
      renderer.setClearColor(clearColor);
      renderer.setClearAlpha(clearAlpha);
      renderer.clear();
    }

    this.scene.overrideMaterial = overrideMaterial;
    renderer.render(this.scene, this.camera);
    this.scene.overrideMaterial = null;

    renderer.autoClear = originalAutoClear;
    renderer.setClearColor(originalClearColor);
    renderer.setClearAlpha(originalClearAlpha);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;

    this.beautyRenderTarget.setSize(width, height);
    this.ssaoRenderTarget.setSize(width, height);
    this.normalRenderTarget.setSize(width, height);
    this.blurRenderTarget.setSize(width, height);

    this.ssaoMaterial.uniforms['resolution'].value.set(width, height);
    this.ssaoMaterial.uniforms['cameraProjectionMatrix'].value.copy(this.camera.projectionMatrix);
    this.ssaoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix);

    this.blurMaterial.uniforms['resolution'].value.set(width, height);
  }

  generateSampleKernel() {
    const kernelSize = this.kernelSize;
    const kernel = this.kernel;

    for (let i = 0; i < kernelSize; i++) {
      const sample = new THREE.Vector3();
      sample.x = (Math.random() * 2) - 1;
      sample.y = (Math.random() * 2) - 1;
      sample.z = Math.random();

      sample.normalize();

      const scale = i / kernelSize;
      scale = THREE.Math.lerp(0.1, 1, scale * scale);
      sample.multiplyScalar(scale);

      kernel.push(sample);
    }
  }

  generateRandomKernelRotations() {
    const width = 4;
    const height = 4;

    if (!THREE.SimplexNoise) {
      console.error('THREE.SSAOPass: The pass relies on THREE.SimplexNoise.');
    }

    const simplex = new THREE.SimplexNoise();

    const size = width * height;
    const data = new Float32Array(size * 4);

    for (let i = 0; i < size; i++) {
      const stride = i * 4;

      const x = (Math.random() * 2) - 1;
      const y = (Math.random() * 2) - 1;
      const z = 0;

      const noise = simplex.noise3d(x, y, z);

      data[stride] = noise;
      data[stride + 1] = noise;
      data[stride + 2] = noise;
      data[stride + 3] = 1;
    }

    this.noiseTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
    this.noiseTexture.wrapS = THREE.RepeatWrapping;
    this.noiseTexture.wrapT = THREE.RepeatWrapping;

    requestAnimationFrame(() => {
      this.updateNoiseTexture();
    });
  }

  updateNoiseTexture() {
    const width = 4;
    const height = 4;

    if (!THREE.SimplexNoise) {
      console.error('THREE.SSAOPass: The pass relies on THREE.SimplexNoise.');
      return;
    }

    const simplex = new THREE.SimplexNoise();

    const size = width * height;
    const data = new Float32Array(size * 4);

    for (let i = 0; i < size; i++) {
      const stride = i * 4;

      const x = (Math.random() * 2) - 1;
      const y = (Math.random() * 2) - 1;
      const z = 0;

      const noise = simplex.noise3d(x, y, z);

      data[stride] = noise;
      data[stride + 1] = noise;
      data[stride + 2] = noise;
      data[stride + 3] = 1;
    }

    this.noiseTexture.needsUpdate = true;
    this.noiseTexture.image.data = data;

    requestAnimationFrame(() => {
      this.updateNoiseTexture();
    });
  }

  updateSSAOUniforms() {
    this.ssaoMaterial.uniforms['tDiffuse'].value = this.beautyRenderTarget.texture;
    this.ssaoMaterial.uniforms['tNormal'].value = this.normalRenderTarget.texture;
    this.ssaoMaterial.uniforms['tDepth'].value = this.beautyRenderTarget.depthTexture;
    this.ssaoMaterial.uniforms['tNoise'].value = this.noiseTexture;
    this.ssaoMaterial.uniforms['kernel'].value = this.kernel;
    this.ssaoMaterial.uniforms['cameraNear'].value = this.camera.near;
    this.ssaoMaterial.uniforms['cameraFar'].value = this.camera.far;
    this.ssaoMaterial.uniforms['resolution'].value.set(this.width, this.height);
    this.ssaoMaterial.uniforms['cameraProjectionMatrix'].value.copy(this.camera.projectionMatrix);
    this.ssaoMaterial.uniforms['cameraInverseProjectionMatrix'].value.getInverse(this.camera.projectionMatrix);
  }

  createRenderTarget(name, width, height, options = {}) {
    const renderTarget = new THREE.WebGLRenderTarget(width, height, options);

    this[name] = renderTarget;

    renderTarget.texture.name = name + 'Texture';

    if (renderTarget.depthBuffer) {
      renderTarget.depthTexture.name = name + 'DepthTexture';
    }

    if (renderTarget.stencilBuffer) {
      renderTarget.depthTexture.name = name + 'StencilTexture';
    }

    renderTarget.texture.generateMipmaps = false;

    if (renderTarget.depthBuffer) {
      renderTarget.depthTexture.generateMipmaps = false;
    }

    if (renderTarget.stencilBuffer) {
      renderTarget.depthTexture.generateMipmaps = false;
    }

    renderTarget.texture.minFilter = THREE.LinearFilter;
    renderTarget.texture.magFilter = THREE.LinearFilter;

    if (renderTarget.depthBuffer) {
      renderTarget.depthTexture.minFilter = THREE.LinearFilter;
      renderTarget.depthTexture.magFilter = THREE.LinearFilter;
    }

    if (renderTarget.stencilBuffer) {
      renderTarget.depthTexture.minFilter = THREE.LinearFilter;
      renderTarget.depthTexture.magFilter = THREE.LinearFilter;
    }

    renderTarget.texture.flipY = false;

    if (renderTarget.depthBuffer) {
      renderTarget.depthTexture.flipY = false;
    }

    if (renderTarget.stencilBuffer) {
      renderTarget.depthTexture.flipY = false;
    }

    this.scene.autoUpdate = false;

    try {
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.setRenderTarget(null);
    } catch (e) {
      console.error('THREE.SSAOPass: Error setting up render target:', e);
    }

    this.scene.autoUpdate = true;
  }
}

THREE.SSAOPass.OUTPUT = {
  Default: 0,
  SSAO: 1,
  Blur: 2,
  Beauty: 3,
  Depth: 4,
  Normal: 5
};

