/**
 * A THREE.js shader for performing a depth-limited blur effect.
 */

THREE.DepthLimitedBlurShader = {
	/**
	 * Defines used in the shader code.
	 */
	defines: {
		"KERNEL_RADIUS": 4,
		"DEPTH_PACKING": 1,
		"PERSPECTIVE_CAMERA": 1
	},
	/**
	 * Uniforms used in the shader code.
	 */
	uniforms: {
		"tDiffuse": { value: null },
		"size": { value: new THREE.Vector2( 512, 512 ) },
		"sampleUvOffsets": { value: [] },
		"sampleWeights": { value: [] },
		"tDepth": { value: null },
		"cameraNear": { value: 10 },
	
