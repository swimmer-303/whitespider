/**
 * @author wongbryan / http://wongbryan.github.io
 *
 * Pixelation shader
 */

THREE.PixelShader = {

	uniforms: {

		tDiffuse: { type: "t", value: null },
		resolution: { type: "v2", value: null },
		pixelRatio: { type: "f", value: 1. },

	},

	vertexShader: [

		"varying highp vec2 vUv;",

		"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float pixelRatio;",
		"uniform vec2 resolution;",

		"varying highp vec2 vUv;",

		"void main(){",

		"vec2 dxy = pixelRatio / resolution;", // Calculate the size of each pixel
		"vec2 coord = dxy * floor( vUv / dxy );",
		"gl_FragColor = texture2D(tDiffuse, coord);",
		"}"

	].join( "\n" )
};

