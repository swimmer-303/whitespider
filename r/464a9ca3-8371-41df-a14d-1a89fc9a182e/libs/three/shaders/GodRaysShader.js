// GodRaysDepthMaskShader
// Generates a mask from the depth map for god ray calculation.

#version 100

uniform sampler2D tInput;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4( 1.0 ) - texture2D( tInput, vUv );
}

// GodRaysGenerateShader
// Calculates the god rays based on the depth mask and sun position.

#version 100

uniform sampler2D tInput;
uniform vec2 sunPosition;
uniform float stepSize;

varying vec2 vUv;

void main() {
  vec2 delta = sunPosition - vUv;
  float dist = length(delta);
  vec2 stepVector = stepSize * delta / dist;
  float iters = dist / stepSize;
  vec2 uv = vUv;
  float col = 0.0;

  for (float i = 0.0; i < 6.0; i++) {
    if (uv.y < 1.0 && i <= iters) {
      col += texture2D(tInput, uv).r;
    }
    uv += stepVector;
  }

  gl_FragColor = vec4(col / 6.0);
  gl_FragColor.a = 1.0;
}

// GodRaysCombineShader
// Combines the god rays with the background scene.

#version 100

uniform sampler2D tColors;
uniform sampler2D tGodRays;
uniform float godRayIntensity;
uniform vec2 sunPosition;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tColors, vUv) + godRayIntensity * vec4(1.0 - texture2D(tGodRays, vUv).r);
  gl_FragColor.a = 1.0;
}

// GodRaysFakeSunShader
// A simple sun/sky shader that creates a bright spot at the sun position.

#version 100

uniform vec2 sunPosition;
uniform float aspect;
uniform vec3 sunColor;
uniform vec3 bgColor;

varying vec2 vUv;

void main() {
  vec2 diff = vUv - sunPosition;
  diff.x *= aspect;
  float prop = clamp(length(diff) / 0.5, 0.0, 1.0);
  prop = 0.35 * pow(1.0 - prop, 3.0);
  gl_FragColor.xyz = mix(sunColor, bgColor, 1.0 - prop);
  gl_FragColor.w = 1.0;
}
