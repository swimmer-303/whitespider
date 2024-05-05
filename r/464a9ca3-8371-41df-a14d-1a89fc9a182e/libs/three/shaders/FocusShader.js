/**
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 *
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.FocusShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"resolution": { value: new THREE.Vector2() },
		"sampleDistance": { value: 0.94 },
		"waveFactor": { value: 0.00125 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float sampleDistance;",
		"uniform float waveFactor;",
		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec4 color = texture2D( tDiffuse, vUv );",
		"	vec2 vin = ( vUv - vec2( 0.5 ) ) * vec2( 1.4 ) * resolution.xy;",
		"	float sample_dist = dot( vin, vin ) * 2.0;",
		"	vec2 sampleSize = vec2( 1.0 / resolution.x, 1.0 / resolution.y ) * vec2( 4.0 * sampleDistance * waveFactor * 100.0 + sample_dist );",
		"	vec4 add = vec4( 0.0 );",

		"	add += texture2D( tDiffuse, vUv + vec2( 0.111964, 0.993712 ) * sampleSize );",
		"	add += texture2D( tDiffuse, vUv + vec2( 0.846724, 0.532032 ) * sampleSize );",
		"	add += texture2D( tDiffuse, vUv + vec2( 0.943883, -0.330279 ) * sampleSize );",
		"	add += texture2D( tDiffuse, vUv + vec2( 0.330279, -0.943883 ) * sampleSize );",
		"	add += texture2D( tDiffuse, vUv + vec2( -0.532032, -0.846724 ) * sampleSize );",
		"	add += texture2D( tDiffuse, vUv + vec2( -0.993712, -0.111964 ) * sampleSize );",
		"	add += texture2D( tDiffuse, vUv + vec2( -0.707107, 0.707107 ) * sampleSize );",

		"	color = mix( color, add, vec4( step( color.b, add.b ) ) );",

		"	gl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );",

		"}"

	].join( "\n" )
};

// Set the resolution uniform
THREE.FocusShader.uniforms.resolution.value.x = window.innerWidth;
THREE.FocusShader.uniforms.resolution.value.y = window.innerHeight;

