/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.TexturePass = function ( map, opacity = 1.0 ) {
  THREE.Pass.call( this );

  if ( THREE.CopyShader === undefined )
    console.error( "THREE.TexturePass relies on THREE.CopyShader" );

  this.copyShader = THREE.CopyShader;

  if ( map === undefined ) {
    console.error( "THREE.TexturePass requires a map parameter" );
    return;
  }

  this.map = map;
  this.opacity = opacity;

  this.uniforms = THREE.UniformsUtils.clone( this.copyShader.uniforms );

  this.material = new THREE.ShaderMaterial( {
    uniforms: this.uniforms,
    vertexShader: this.copyShader.vertexShader,
    fragmentShader: this.copyShader.fragmentShader,
    depthTest: false,
    depthWrite: false,
    transparent: this.opacity < 1.0
  } );

  this.needsSwap = false;

  this.fsQuad = new THREE.Pass.FullScreenQuad( null );
};

THREE.TexturePass.prototype = Object.create( THREE.Pass.prototype );
THREE.TexturePass.prototype.constructor = THREE.TexturePass;

THREE.TexturePass.prototype.render = function ( renderer, writeBuffer, readBuffer, deltaTime, maskActive ) {
  const oldAutoClear = renderer.autoClear;
  renderer.autoClear = false;

  this.fsQuad.material = this.material;

  this.uniforms[ "opacity" ].value = this.opacity;
  this.uniforms[ "tDiffuse" ].value = this.map;

  renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );

  if ( this.clear ) renderer.clear();

  this.fsQuad.render( renderer );

  renderer.autoClear = oldAutoClear;
};
