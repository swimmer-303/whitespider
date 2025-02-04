/**
 * Depth-of-field post-process with bokeh shader
 */

class BokehPass extends THREE.Pass {

	constructor( scene, camera, params = {} ) {

		super();

		this.scene = scene;
		this.camera = camera;

		const { focus = 1.0, aspect = camera.aspect, aperture = 0.025, maxblur = 1.0, width = window.innerWidth, height = window.innerHeight } = params;

		// render targets

		this.renderTargetColor = new THREE.WebGLRenderTarget( width, height, {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBFormat
		} );
		this.renderTargetColor.texture.name = "BokehPass.color";

		this.renderTargetDepth = this.renderTargetColor.clone();
		this.renderTargetDepth.texture.name = "BokehPass.depth";

		// depth material

		this.materialDepth = new THREE.MeshDepthMaterial();
		this.materialDepth.depthPacking = THREE.RGBADepthPacking;
		this.materialDepth.blending = THREE.NoBlending;

		// bokeh material

		if ( THREE.BokehShader === undefined ) {

			console.error( "THREE.BokehPass relies on THREE.BokehShader" );

		}

		const bokehShader = THREE.BokehShader;
		const bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );

		bokehUniforms[ "tDepth" ].value = this.renderTargetDepth.texture;

		bokehUniforms[ "focus" ].value = focus;
		bokehUniforms[ "aspect" ].value = aspect;
		bokehUniforms[ "aperture" ].value = aperture;
		bokehUniforms[ "maxblur" ].value = maxblur;
		bokehUniforms[ "nearClip" ].value = camera.near;
		bokehUniforms[ "farClip" ].value = camera.far;

		this.materialBokeh = new THREE.ShaderMaterial( {
			defines: Object.assign( {}, bokehShader.defines ),
			uniforms: bokehUniforms,
			vertexShader: bokehShader.vertexShader,
			fragmentShader: bokehShader.fragmentShader
		} );

		this.uniforms = bokehUniforms;
		this.needsSwap = false;

		this.fsQuad = new THREE.Pass.FullScreenQuad( this.materialBokeh );

		this.oldClearColor = new THREE.Color();

	}

	render( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive*/ ) {

		// Render depth into texture

		this.scene.overrideMaterial = this.materialDepth;

		const { oldClearColor, oldClearAlpha, autoClearColor } = renderer;
		this.oldClearColor.copy( renderer.getClearColor() );
		renderer.setClearColor( 0xffffff );
		renderer.setClearAlpha( 1.0 );
		renderer.autoClearColor = true;
		renderer.setRenderTarget( this.renderTargetDepth );
		renderer.clear();
		renderer.render( this.scene, this.camera );

		// Render bokeh composite

		this.uniforms[ "tColor" ].value = readBuffer.texture;
		this.uniforms[ "nearClip" ].value = this.camera.near;
		this.uniforms[ "farClip" ].value = this.camera.far;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );

		} else {

			renderer.setRenderTarget( writeBuffer );
			renderer.clear();
			this.fsQuad.render( renderer );

		}

		renderer.setClearColor( this.oldClearColor );
		renderer.setClearAlpha( oldClearAlpha );
		renderer.autoClearColor = autoClearColor;

	}

}

