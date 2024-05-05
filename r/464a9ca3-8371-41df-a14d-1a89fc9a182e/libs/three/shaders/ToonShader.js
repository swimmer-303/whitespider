/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function ToonShader(options) {
  this.uniforms = {
    uDirLightPos: { value: new THREE.Vector3() },
    uDirLightColor: { value: new THREE.Color(0xeeeeee) },
    uAmbientLightColor: { value: new THREE.Color(0x050505) },
    uBaseColor: { value: new THREE.Color(0xffffff) }
  };

  this.vertexShader = [
    "varying vec3 vNormal;",
    "varying vec3 vRefract;",

    "void main() {",
    "	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
    "	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
    "	vec3 worldNormal = normalize ( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

    "	vNormal = normalize( normalMatrix * normal );",

    "	vec3 I = worldPosition.xyz - cameraPosition;",
    "	vRefract = refract( normalize( I ), worldNormal, 1.02 );",

    "	gl_Position = projectionMatrix * mvPosition;",

    "}"
  ].join("\n");

  this.fragmentShader = this.createFragmentShader(options.lines);
}

ToonShader.prototype.createFragmentShader = function (lines) {
  let colorUniforms = "";
  let lineTests = "";

  for (let i = 1; i <= lines.length; i++) {
    colorUniforms += `uLineColor${i}: { value: new THREE.Color( 0x${lines[i - 1].color.getHexString()} ) },\n`;
    lineTests += `if ( length(lightWeighting) < ${lines[i - 1].threshold} ) {\n`;
    lineTests += `	if (${lines[i - 1].condition}) {\n`;
    lineTests += `		gl_FragColor = vec4( uLineColor${i}, 1.0 );\n`;
    lineTests += `	}\n`;
    lineTests += `}\n`;
  }

  return [
    `uniform vec3 uBaseColor;`,

    `uniform vec3 uDirLightPos;`,
    `uniform vec3 uDirLightColor;`,

    `uniform vec3 uAmbientLightColor;`,

    `varying vec3 vNormal;`,

    `varying vec3 vRefract;`,

    `void main() {`,

    `	float directionalLightWeighting = max( dot( normalize( vNormal ), uDirLightPos ), 0.0);`,
    `	vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;`,

    `	float intensity = smoothstep( - 0.5, 1.0, pow( length(lightWeighting), 20.0 ) );`,
    `	intensity += length(lightWeighting) * 0.2;`,

    `	float cameraWeighting = dot( normalize( vNormal ), vRefract );`,
    `	intensity += pow( 1.0 - length( cameraWeighting ), 6.0 );`,
    `	intensity = intensity * 0.2 + 0.3;`,

    `	if ( intensity < 0.50 ) {`,

    `		gl_FragColor = vec4( 2.0 * intensity * uBaseColor, 1.0 );`,

    `	} else {`,

    `		gl_FragColor = vec4( 1.0 - 2.0 * ( 1.0 - intensity ) * ( 1.0 - uBaseColor ), 1.0 );`,

    `	}`,

    lineTests,

    `}`
  ].join("\n") + colorUniforms;
};

const toonShaders = {
  ToonShader1: {
    lines: [
      { color: new THREE.Color(0x000000), threshold: 1.00 }
    ]
  },
  ToonShader2: {
    lines: [
      { color: new THREE.Color(0x808080), threshold: 1.00, condition: `length(uAmbientLightColor + uDirLightColor * light) < 1.00` },
      { color: new THREE.Color(0x000000), threshold: 0.50, condition: `length(uAmbientLightColor + uDirLightColor * camera) < 0.50` }
    ]
  },
  ToonShaderHatching: {
    lines: [
      { color: new THREE.Color(0x000000), threshold: 1.00, condition: `mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0` },
      { color: new THREE.Color(0x000000), threshold: 0.75, condition: `mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0` },
      { color: new THREE.Color(0x000000), threshold: 0.50, condition: `mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0` },
      { color: new THREE.Color(0x000000), threshold: 0.3465, condition: `mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0` }
    ]
  },
  ToonShaderDotted: {
    lines: [
      { color: new THREE.Color(0x000000), threshold: 1.00, condition: `( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00` },
      { color: new THREE.Color(0x000000), threshold: 0.50, condition: `( mod(gl_FragCoord.x + 2.0, 4.001) + mod(gl_FragCoord.y + 2.0, 4.0) ) > 6.00` }
    ]
  }
};

for (const name in toonShaders) {
  Object.assign(THREE, { [name]: new ToonShader(toonShaders[name]) });
}
