export default `
#define SHADER_NAME slope-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D bitmapTexture;

varying vec2 vTexCoord;

uniform float desaturate;
uniform vec4 transparentColor;
uniform vec3 tintColor;
uniform float opacity;

const float PI_2 = 1.57079632679489661923;

// define constant azimuth, altitude in radians for now
const float azimuth = -3.9269908169872414;
const float altitude = 0.7853981633974483;

// hypotenuse length
float hypot(vec2 xy) {
  return sqrt(pow(xy.x, 2.0) + pow(xy.y, 2.0));
}

// apply desaturation
vec3 color_desaturate(vec3 color) {
  float luminance = (color.r + color.g + color.b) * 0.333333333;
  return mix(color, vec3(luminance), desaturate);
}

// apply tint
vec3 color_tint(vec3 color) {
  return color * tintColor;
}

// blend with background color
vec4 apply_opacity(vec3 color, float alpha) {
  return mix(transparentColor, vec4(color, 1.0), alpha);
}

// rescale normals from [0, 1] to [-1, 1]
vec2 rescale(vec2 xy) {
  return (xy * 2.) - 1.0;
}

// compute aspect
float compute_aspect(vec2 xy) {
  return atan(xy.y, xy.x);
}

// compute slope
float compute_slope(vec2 xy) {
  return PI_2 - atan(hypot(xy));
}

// intensity (aka the hillshade)
float compute_intensity(float slope, float aspect, float altitude, float azimuth) {
  return (
    (sin(altitude) * sin(slope)) +
    (cos(altitude) * cos(slope) * cos(azimuth - aspect))
  );
}


void main(void) {
  vec4 bitmapColor = texture2D(bitmapTexture, vTexCoord);

  vec2 normals = rescale(bitmapColor.xy);

  float aspect = compute_aspect(normals.xy);
  float slope = compute_slope(normals.xy);
  float intensity = compute_intensity(slope, aspect, altitude, azimuth);

  gl_FragColor = vec4(intensity, intensity, intensity, 1);
  // gl_FragColor = vec4(intensity, intensity, intensity, 0);

  // gl_FragColor = apply_opacity(color_tint(color_desaturate(bitmapColor.rgb)), bitmapColor.a * opacity);

  geometry.uv = vTexCoord;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;