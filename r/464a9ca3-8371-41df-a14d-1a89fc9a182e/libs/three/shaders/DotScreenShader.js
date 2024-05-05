/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

THREE.DotScreenShader = {

	uniforms: {

		"tDiffuse": { value: null }, // input texture
		"tSize": { value: new THREE.Vector2( 256, 256 ) }, // texture size
		"center": { value: new THREE.Vector2( 0.5, 0.5 ) }, // center of the dot pattern
		"angle": { value: 1.57 }, // angle of the dot pattern
		"scale": { value: 1.0 } // scale of the dot pattern

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

	
