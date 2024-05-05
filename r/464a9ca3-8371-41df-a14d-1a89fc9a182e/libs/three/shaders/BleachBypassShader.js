/**
 * Bleach bypass post-processing shader.
 * Based on Nvidia example:
 * http://developer.download.nvidia.com/shaderlibrary/webpages/shader_library.html#post_bleach_bypass
 */

#version 300 es
precision highp float;

// Uniforms
uniform sampler2D tDiffuse;
uniform float opacity;

// Varying variables
varying vec2 vUv;

// Vertex shader
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment shader
void main() {
  // Sample the input texture
  vec4 base = texture(tDiffuse, vUv);

  // Calculate the luminance coefficient
  vec3 lumCoeff = vec3(0.25, 0.65, 0.1);
  float lum = dot(lumCoeff, base.rgb);

  // Calculate the blend factor
  vec3 blend = vec3(lum);

  // Calculate the blend factor based on the luminance
  float L = min(1.0, max(0.0, 10.0 * (lum - 0.45)));

  // Calculate the two possible color results
  vec3 result1 = 2.0 * base.rgb * blend;
  vec3 result2 = 1.0 - 2.0 * (1.0 - blend) * (1.0 - base.rgb);

  // Choose the final color based on the luminance
  vec3 newColor = mix(result1, result2, L);

  // Calculate the final output color
  float A2 = opacity * base.a;
  vec3 mixRGB = A2 * newColor.rgb;
  mixRGB += (1.0 - A2) * base.rgb;

  // Output the final color
  gl_FragColor = vec4(mixRGB, base.a);
}
