/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	// Call the parent class constructor
	THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;

};

// Inherit from THREE.Pass
THREE.ShaderPass.prototype = Object.create( THREE.Pass.prototype );
THREE.ShaderPass.prototype.constructor = THREE.ShaderPass;

THREE.ShaderPass.prototype.render = function ( pass, gl, readBuffer ) {

	if ( shader === null || shader === undefined ) {

		console.error( "ShaderPass: shader is null or undefined" );
		return;

	}

	if ( this.uniforms === null || this.uniforms === undefined ) {

		console.error( "ShaderPass: this.uniforms is null or undefined" );
	
