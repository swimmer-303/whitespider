/**
 * A two-pass Gaussian blur filter, consisting of horizontal and vertical blur shaders.
 * - Based on the description in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.HorizontalBlurShader = {

    name: 'HorizontalBlurShader',

    uniforms: {

        tDiffuse: { value: null },
        h: { value: 1.0 / 512.0 } // should be set to 1 / width

    },

    vertexShader: [

        'varying vec2 vUv;',

        'void main() {',

        '	vUv = uv;',
        '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

        '}'

    ].join( "\n" ),

    fragmentShader: [

        'uniform sampler2D tDiffuse;',
        'uniform float h;',

        'varying vec2 vUv;',

        'void main() {',

        '	vec4 sum = vec4( 0.0 );',

        '	for( int i = -4; i <= 4; i++ ) {',
        '		float multiplier = 0.051 * (1.0 / 9.0) + 0.1633 * (i == 0 ? 1.0 : 0.0);',
        '		sum += texture2D( tDiffuse, vec2( vUv.x + float(i) * h, vUv.y ) ) * multiplier;',
        '	}',

        '	gl_FragColor = sum;',

        '}'

    ].join( "\n" )

};

