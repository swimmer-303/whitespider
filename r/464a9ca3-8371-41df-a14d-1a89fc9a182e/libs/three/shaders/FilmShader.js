// Film grain & scanlines shader
// - ported from HLSL to WebGL / GLSL
// - Original implementation and noise algorithm
//   Pat 'Hawthorne' Shearon
// - Optimized scanlines + noise version with intensity scaling
//   Georg 'Leviathan' Steinrohder
//
// This version is provided under a Creative Commons Attribution 3.0 License
// http://creativecommons.org/licenses/by/3.0/

const PI = 3.14159265359;

THREE.FilmShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"time": { value: 0.0 },
		"nIntensity": { value: 0.5 },
		"sIntensity": { value: 0.05 },
		"sCount": { value: 4096 },
		"grayscale": { value: 1 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"#version 300 es",
		"precision highp float;",

		"#define PI 3.14159265359",

		// control parameter
		"uniform float time;",

		"const bool grayscale = true;",

		// noise effect intensity value (0 = no effect, 1 = full effect)
		"uniform float nIntensity;",

		// scanlines effect intensity value (0 = no effect, 1 = full effect)
		"uniform float sIntensity;",

		// scanlines effect count value (0 = no effect, 4096 = full effect)
		"uniform float sCount;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

		// sample the source
		"	vec4 cTextureScreen = texture( tDiffuse, vUv );",

		// make some noise
		"	float dx = fract(sin(dot(vec2(1.0), vUv * 12.9898 + vec2(time))) * 43758.5453);",

		// add noise
		"	vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );",

		// get us a sine and cosine
		"	vec2 sc = vec2( sin(vUv.y * sCount), cos(vUv.y * sCount) );",

		// add scanlines
		"	cResult += cTextureScreen.rgb * vec3(sc.x, sc.y, sc.x) * sIntensity;",

		// interpolate between source and result by intensity
		"	cResult = cTextureScreen.rgb + clamp(nIntensity, 0.0, 1.0) * (cResult - cTextureScreen.rgb);",

		// convert to grayscale if desired
		"	if (grayscale) {",

		"		cResult = vec3(cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11);",

		"	}",

		"	gl_FragColor = vec4(cResult, cTextureScreen.a);",

		"}",

	].join( "\n" )

};
