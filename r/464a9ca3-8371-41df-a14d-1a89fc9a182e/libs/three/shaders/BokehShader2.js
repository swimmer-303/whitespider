/**
 * @author zz85 / https://github.com/zz85 | twitter.com/blurspline
 *
 * Depth-of-field shader with bokeh
 * ported from GLSL shader by Martins Upitis
 * http://blenderartists.org/forum/showthread.php?237488-GLSL-depth-of-field-with-bokeh-v2-4-(update)
 *
 * Requires #define RINGS and SAMPLES integers
 */

#define SAMPLES 16
#define RINGS 4

THREE.BokehShader = {

	uniforms: {

		"textureWidth": { value: 1.0 },
		"textureHeight": { value: 1.0 },

		"focalDepth": { value: 1.0 },
		"focalLength": { value: 24.0 },
		"fstop": { value: 0.9 },

		"tColor": { value: null },
		"tDepth": { value: null },

		"maxblur": { value: 1.0 },

		"showFocus": { value: 0 },
		"manualdof": { value: 0 },
		"vignetting": { value: 0 },
		"depthblur": { value: 0 },

		"threshold": { value: 0.5 },
		"gain": { value: 2.0 },
		"bias": { value: 0.5 },
		"fringe": { value: 0.7 },

		"znear": { value: 0.1 },
		"zfar": { value: 100 },

		"noise": { value: 1 },
		"dithering": { value: 0.0001 },
		"pentagon": { value: 0 },

		"shaderFocus": { value: 1 },
		"focusCoords": { value: new THREE.Vector2() },
		"time": { value: 0.0 },
		"power": { value: 1.0 },
		"swirl": { value: 0.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"#include <common>",

		"varying vec2 vUv;",

		"uniform sampler2D tColor;",
		"uniform sampler2D tDepth;",
		"uniform float textureWidth;",
		"uniform float textureHeight;",

		"uniform float focalDepth;",
		"uniform float focalLength;",
		"uniform float fstop;",

		"uniform bool showFocus;",

		"uniform float znear;",
		"uniform float zfar;",

		"const int samples = SAMPLES;",
		"const int rings = RINGS;",

		"const int maxringsamples = rings * samples;",

		"uniform bool manualdof;",
		"float ndofstart = 1.0;",
		"float ndofdist = 2.0;",
		"float fdofstart = 1.0;",
		"float fdofdist = 3.0;",

		"float CoC = 0.03;",

		"uniform bool vignetting;",
		"float vignout = 1.3;",
		"float vignin = 0.0;",
		"float vignfade = 22.0;",

		"uniform bool shaderFocus;",
		"uniform vec2 focusCoords;",

		"uniform float maxblur;",

		"uniform float threshold;",
		"uniform float gain;",

		"uniform float bias;",
		"uniform float fringe;",

		"uniform bool noise;",
		"uniform float dithering;",

		"uniform bool depthblur;",
		"float dbsize = 1.25;",

		"uniform bool pentagon;",
		"float feather = 0.4;",

		"float penta(vec2 coords) {",
		"	float scale = float(rings) - 1.3;",
		"	vec4  HS0 = vec4( 1.0,         0.0,         0.0,  1.0);",
		"	vec4  HS1 = vec4( 0.309016994, 0.951056516, 0.0,  1.0);",
		"	vec4  HS2 = vec4(-0.809016994, 0.587785252, 0.0,  1.0);",
		"	vec4  HS3 = vec4(-0.809016994,-0.587785252, 0.0,  1.0);",
		"	vec4  HS4 = vec4( 0.309016994,-0.951056516, 0.0,  1.0);",
		"	vec4  HS5 = vec4( 0.0        ,0.0         , 1.0,  1.0);",
		"	vec4  one = vec4( 1.0 );",
		"	vec4 P = vec4((coords),vec2(scale, scale));",
		"	vec4 dist = vec4(0.0);",
		"	float inorout = -4.0;",
		"	dist.x = dot( P, HS0 );",
		"	dist.y = dot( P, HS1 );",
		"	dist.z = dot( P, HS2 );",
		"	dist.w = dot( P, HS3 );",
		"	dist = smoothstep( -feather, feather, dist );",
		"	inorout += dot( dist, one );",
		"	dist.x = dot( P, HS4 );",
		"	dist.y = HS5.w - abs( P.z );",
		"	dist = smoothstep( -feather, feather, dist );",
		"	inorout += dist.x;",
		"	return clamp( inorout, 0.0, 1.0 );",
		"}",

		"float bdepth(vec2 coords) {",
		"	float d = 0.0;",
		"	float kernel[9];",
		"	vec2 offset[9];",
		"	vec2 wh = vec2(1.0/textureWidth,1.0/textureHeight) * dbsize;",
		"	offset[0] = vec2(-wh.x,-wh.y);",
		"	offset[1] = vec2( 0.0, -wh.y);",
		"	offset[2] = vec2( wh.x -wh.y);",
		"	offset[3] = vec2(-wh.x,  0.0);",
		"	offset[4] = vec2( 0.0,   0.0);",
		"	offset[5] = vec2( wh.x,  0.0);",
		"	offset[6] = vec2(-wh.x, wh.y);",
		"	offset[7] = vec2( 0.0,  wh.y);",
		"	offset[8] = vec2( wh.x, wh.y);",
		"	kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;",
		"	kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;",
		"	kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;",
		"	for( int i=0; i<9; i++ ) {",
		"		float tmp = texture2D(tDepth, coords + offset[i]).r;",
		"		d += tmp * kernel[i];",
		"	}",
		"	return d;",
		"}",

		"vec3 color(vec2 coords,float blur) {",
		"	vec3 col = vec3(0.0);",
		"	vec2 texel = vec2(1.0/textureWidth,1.0/textureHeight);",
		"	col.r = texture2D(tColor,coords + vec2(0.0,1.0)*texel*fringe*blur).r;",
		"	col.g = texture2D(tColor,coords + vec2(-0.866,-0.5)*texel*fringe*blur).g;",
		"	col.b = texture2D(tColor,coords + vec2(0.866,-0.5)*texel*fringe*blur).b;",
		"	vec3 lumcoeff = vec3(0.299,0.587,0.114);",
		"	float lum = dot(col.rgb, lumcoeff);",
		"	float thresh = max((lum-threshold)*gain, 0.0);",
		"	return col+mix(vec3(0.0),col,thresh*blur);",
		"}",

		"vec3 debugFocus(vec3 col, float blur, float depth) {",
		"	float edge = 0.002*depth;",
		"	float m = clamp(smoothstep(0.0,edge,blur),0.0,1.0);",
		"	float e = clamp(smoothstep(1.0-edge,1.0,blur),0.0,1.0);",
		"	col = mix(col,vec3(1.0,0.5,0.0),(1.0-m)*0.6);",
		"	col = mix(col,vec3(0.0,0.5,1.0),((1.0-e)-(1.0-m))*0.2);",
		"	return col;",
		"}",

		"float linearize(float depth) {",
		"	return -zfar * znear / (depth * (zfar - znear) - zfar);",
		"}",

		"float vignette() {",
		"	float dist = distance(vUv.xy, vec2(0.5,0.5));",
		"	dist = smoothstep(vignout+(fstop/vignfade), vignin+(fstop/vignfade), dist);",
		"	return clamp(dist,0.0,1.0);",
		"}",

		"float gather(float i, float j, int ringsamples, inout vec3 col, float w, float h, float blur) {",
		"	float rings2 = float(rings) - 1.3;",
		"	float step = PI*2.0 / float(ringsamples);",
		"	float pw = cos(j*step)*i;",
		"	float ph = sin(j*step)*i;",
		"	float p = 1.0;",
		"	if (pentagon) {",
		"		p = penta(vec2(pw,ph));",
		"	}",
		"	col += color(vUv.xy + vec2(pw*w,ph*h), blur) * mix(1.0, i/rings2, bias) * p;",
		"	return 1.0 * mix(1.0, i /rings2, bias) * p;",
		"}",

		"void main() {",
		"	float depth = linearize(texture2D(tDepth,vUv.xy).x);",
		"	if ( depthblur ) {",
		"		depth = linearize(bdepth(vUv.xy));",
		"	}",
		"	float fDepth = focalDepth;",
		"	if (shaderFocus) {",
		"		fDepth = linearize(texture2D(tDepth,focusCoords).x);",
		"	}",
		"	float blur = 0.0;",
		"	if (manualdof) {",
		"		float a = depth-fDepth;",
		"		float b = (a-fdofstart)/fdofdist;",
		"		float c = (-a-ndofstart)/ndofdist;",
		"		blur = (a>0.0) ? b : c;",
		"	} else {",
		"		float f = focalLength;",
		"		float d = fDepth*1000.0;",
		"		float o = depth*1000.0;",
		"		float a = (o*f)/(o-f);",
		"		float b = (d*f)/(d-f);",
		"		float c = (d-f)/(d*fstop*CoC);",
		"		blur = abs(a-b)*c;",
		"	}",
		"	blur = clamp(blur,0.0,1.0);",
		"	vec2 noise = vec2(rand(vUv.xy), rand( vUv.xy + vec2( 0.4, 0.6 ) ))*dithering*blur;",
		"	float w = (1.0/textureWidth)*blur*maxblur+noise.x;",
		"	float h = (1.0/textureHeight)*blur*maxblur+noise.y;",
		"	vec3 col = vec3(0.0);",
		"	if(blur < 0.05) {",
		"		col = texture2D(tColor, vUv.xy).rgb;",
		"	} else {",
		"		col = texture2D(tColor, vUv.xy).rgb;",
		"		float s = 1.0;",
		"		int ringsamples;",
		"		for (int i = 1; i <= rings; i++) {",
		"			ringsamples = i * samples;",
		"			for (int j = 0 ; j < maxringsamples ; j++) {",
		"				if (j >= ringsamples) break;",
		"				s += gather(float(i), float(j), ringsamples, col, w, h, blur);",
		"			}",
		"		}",
		"		col /= s;",
		"	}",
		"	float vign = vignette();",
		"	col = mix(col, vec3(0.0), clamp(blur - 0.05, 0.0, 1.0) * vign * 0.3);",
		"	float timeMod = mod(time, 10.0);",
		"	float swirl = timeMod * 0.1;",
		"	float power = 1.0;",
		"	mat2 rot = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl));",
		"	vec2 uvOff = vUv - 0.5;",
		"	uvOff = rot * uvOff * (1.0 - blur) + 0.5;",
		"	col = pow(col, vec3(power));",
		"	gl_FragColor = vec4(col, 1.0);",
		"}

	"

].join( "\n" )

};

THREE.BokehDepthShader = {

	uniforms: {

		"mNear": { value: 1.0 },
		"mFar": { value: 1000.0 },

	},

	vertexShader: [

		"varying float v
