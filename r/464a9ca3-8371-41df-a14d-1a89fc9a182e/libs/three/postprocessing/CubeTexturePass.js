/**
 * @author bhouston / http://clara.io/
 */

THREE.CubeTexturePass = function (camera, envMap, opacity) {
  THREE.Pass.call(this);

  this.camera = camera;

  this.needsSwap = false;

  this.cubeShader = THREE.ShaderLib['cube'];
  this.cubeMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(10, 10, 10),
    new THREE.ShaderMaterial({
      uniforms: this.cubeShader.uniforms,
      vertexShader: this.cubeShader.vertexShader,
      fragmentShader: this.cubeShader.fragmentShader,
      depthTest: false,
      depthWrite: false,
      side: THREE.BackSide,
    })
  );

  Object.defineProperty(this.cubeMesh.material, 'envMap', {
    get: function () {
      return this.uniforms.envMap.value;
    },
  });

  this.envMap = envMap;
  this.opacity = opacity !== undefined ? opacity : 1.0;

  this.cubeScene = new THREE.Scene();
  const {projectionMatrix, matrixWorld} = camera;
  this.cubeCamera = new THREE.PerspectiveCamera().copy(projectionMatrix, camera.aspect);
  this.cubeCamera.quaternion.setFromRotationMatrix(matrixWorld);
  this.cubeScene.add(this.cubeMesh);
};

THREE.CubeTexturePass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {
  constructor: THREE.CubeTexturePass,

  render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;

    this.cubeCamera.projectionMatrix.copy(this.camera.projectionMatrix);
    this.cubeCamera.quaternion.setFromRotationMatrix(this.camera.matrixWorld);

    this.cubeMesh.material.uniforms.envMap.value = this.envMap;
    this.cubeMesh.material.uniforms.opacity.value = this.opacity;
    this.cubeMesh.material.transparent = this.opacity < 1.0;

    renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
    if (this.clear) renderer.setClearColor(0x000000, 0); // setClearColor instead of clear
    renderer.render(this.cubeScene, this.cubeCamera);

    renderer.autoClear = oldAutoClear;

    // Dispose resources when the object is garbage collected
    this.cubeMesh.material.uniforms.envMap.value = null;
    this.cubeMesh.material.uniforms.opacity.value = null;
    this.cubeMesh.material.transparent = null;
    this.envMap = null;
    this.cubeMesh = null;
    this.cubeScene = null;
    this.cubeCamera = null;
  },
});
