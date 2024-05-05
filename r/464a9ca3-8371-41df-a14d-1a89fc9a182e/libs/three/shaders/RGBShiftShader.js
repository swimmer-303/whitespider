/**
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * along the specified axis.
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * @author felixturner / http://airtight.cc/
 * @modified mikethedj4 / https://github.com/mikethedj4
 */

THREE.RGBShiftShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"amount": { value: 0.01 }, // default shift amount
		"angle": { value: 0.0 },
		"axis": { value: 1.0 } // 1 for x-axis, 0 for y-axis

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float amount;",
		"uniform float angle;",
		"uniform float axis;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec2 uvOffset = amount * vec2( cos(angle), axis * sin(angle));",
		"	vec4 colorRight = texture2D(tDiffuse, vUv + uvOffset);",
		"	vec4 colorCenter = texture2D(tDiffuse, vUv);",
		"	vec4 colorLeft = texture2D(tDiffuse, vUv - uvOffset);",
		"	gl_FragColor = vec4(colorRight.r, colorCenter.g, colorLeft.b, colorCenter.a);",

		"}",

		"void checkShaderError( WebGLProgram program, int shaderType ) {",

		"	WebGLShader shader = gl.getAttachedShaders( program )[shaderType];",
		"	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == false) {",
		"		console.log('Shader error: ' + gl.getShaderInfoLog(shader));",
		"	}",

		"}"

	].join( "\n" )

};

// Check for shader compilation errors
checkShaderError( THREE.RGBShiftShader.program, 0 ); // vertex shader
checkShaderError( THREE.RGBShiftShader.program, 1 ); // fragment shader
