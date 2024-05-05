/**
 * Triangle blur shader
 * based on glfx.js triangle blur shader
 * https://github.com/evanw/glfx.js
 *
 * A basic blur filter, which convolves the image with a
 * pyramid filter. The pyramid filter is separable and is applied as two
 * perpendicular triangle filters.
 */

#ifdef GL_ES
precision highp float;
#endif

#define ITERATIONS 10.0
#define TWO_PI 6.2831853

uniform sampler2D texture;
uniform vec2 delta;

varying vec2 vUv;

void main() {
	vec4 color = vec4(0.0);
	float total = 0.0;

	// randomize the lookup values to hide the fixed number of samples
	float offset = fract(sin(dot(vUv, vec2(12.9898,78.233))) * 43758.5453);

	for (float t = -ITERATIONS; t <= ITERATIONS; t++) {
		float percent = (t + offset - 0.5) / ITERATIONS;
		float weight = 1.0 - abs(percent);

		vec2 texOffset = delta * percent;
		color += texture2D(texture, vUv + texOffset) * weight;
		total += weight;
	}

	gl_FragColor = color / total;
}
