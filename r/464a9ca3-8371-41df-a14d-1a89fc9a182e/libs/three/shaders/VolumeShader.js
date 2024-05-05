const int MAX_STEPS = 887;
const int REFINEMENT_STEPS = 4;
const float relative_step_size = 1.0;
const vec4 ambient_color = vec4(0.2, 0.4, 0.2, 1.0);
const vec4 diffuse_color = vec4(0.8, 0.2, 0.2, 1.0);
const vec4 specular_color = vec4(1.0, 1.0, 1.0, 1.0);
const float shininess = 40.0;

THREE.VolumeRenderShader1 = {
  type: 'x-shader/x-vertex',
  uniforms: {
    "u_size": { value: new THREE.Vector3(1, 1, 1) },
    "u_renderstyle": { value: 0 },
    "u_renderthreshold": { value: 0.5 },
    "u_clim": { value: new THREE.Vector2(1, 1) },
    "u_data": { value: null },
    "u_cmdata": { value: null }
  },
  vertexShader: [
    "varying vec4 v_nearpos;",
    "varying vec4 v_farpos;",
    "varying vec3 v_position;",

    "mat4 inversemat(mat4 m) {",
    "  return inverse(m);",
    "}",

    "void main() {",
    "  mat4 viewtransformf = modelViewMatrix;",
    "  mat4 viewtransformi = inversemat(modelViewMatrix);",

    "  vec4 position4 = vec4(position, 1.0);",
    "  vec4 pos_in_cam = viewtransformf * position4;",

    "  pos_in_cam.z = -pos_in_cam.w;",
    "  v_nearpos = viewtransformi * pos_in_cam;",

    "  pos_in_cam.z = pos_in_cam.w;",
    "  v_farpos = viewtransformi * pos_in_cam;",

    "  v_position = position;",
    "  gl_Position = projectionMatrix * viewMatrix * modelMatrix * position4;",
    "}"
  ].join("\n"),
  fragmentShader: [
    "precision highp float;",
    "precision mediump sampler3D;",

    "uniform vec3 u_size;",
    "uniform int u_renderstyle;",
    "uniform float u_renderthreshold;",
    "uniform vec2 u_clim;",

    "uniform sampler3D u_data;",
    "uniform sampler2D u_cmdata;",

    "varying vec3 v_position;",
    "varying vec4 v_nearpos;",
    "varying vec4 v_farpos;",

    "float sample1(vec3 texcoords) {",
    "  return texture(u_data, texcoords.xyz).r;",
    "}",

    "vec4 apply_colormap(float val) {",
    "  val = (val - u_clim[0]) / (u_clim[1] - u_clim[0]);",
    "  return texture2D(u_cmdata, vec2(val, 0.5));",
    "}",

    "void cast_mip(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {",
    "  ...",
    "}",

    "void cast_iso(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {",
    "  ...",
    "}",

    "vec4 add_lighting(float val, vec3 loc, vec3 step, vec3 view_ray) {",
    "  ...",
    "}"
  ].join("\n")
};
