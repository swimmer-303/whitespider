/**
 * Normal map shader
 * - compute normals from heightmap
 */

THREE.NormalMapShader = {

	uniforms: {

		"heightMap": { value: null },
		"resolution": { value: new THREE.Vector2( 512, 512 ) },
		"scale": { value: new THREE.Vector2( 1, 1 ) },
		"height": { value: new THREE.Vector2( 0.05, 0.05 ) },
		"bias": { value: new THREE.Vector2( 0, 0 ) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

	
