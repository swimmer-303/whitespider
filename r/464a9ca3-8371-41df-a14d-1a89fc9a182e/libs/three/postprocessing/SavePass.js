/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SavePass = function ( width, height, renderTarget ) {

  THREE.Pass.call( this );

  if ( THREE.UniformsLib['copy'] === undefined )
    console.error( "THREE.SavePass relies on THREE.UniformsLib['copy']" );

  this.textureID = "tDiffuse";

  this.uniforms = THREE.UniformsUtils.clone( THREE.UniformsLib['copy'].uniforms );

  this.material = new THREE.ShaderMaterial( {

    uniforms: this.uniforms,
    vertexShader: THREE.UniformsLib['copy'].vertexShader,
    fragmentShader: THREE.UniformsLib['copy'].fragmentShader

  } );

  this.width = width || window.innerWidth;
  this.height = height || window.innerHeight;

  this.renderTarget = renderTarget;

  if ( this.renderTarget === undefined ) {

    this.renderTarget = new THREE.WebGLRenderTarget( this.width, this.height, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false } );
    this.renderTarget.texture.name = "SavePass.rt";

  }

  this.needsSwap = false;

  this.fsQuad = new THREE.Pass.FullScreenQuad( this.material );

};

THREE.SavePass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

  constructor: THREE.SavePass,

  render: function ( renderer, writeBuffer, readBuffer ) {

    if ( this.uniforms[ this.textureID ] ) {

      this.uniforms[ this.textureID ].value = readBuffer.texture;

    }

    renderer.setRenderTarget( this.renderTarget );
    if ( this.clear ) renderer.clear();
    this.fsQuad.render( renderer );

  },

  dispose: function() {
    this.material.dispose();
    this.renderTarget.dispose();
  }

} );
