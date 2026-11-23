precision highp float;

#define MAX_CREASES 32

uniform vec2 uRes;          // canvas size in device pixels
uniform vec2 uSheet;        // sheet size in sheet units (landscape)
uniform float uFit;         // 0 = cover the viewport, 1 = contain with margin
uniform float uMargin;      // margin when contained (fraction of the short side)
uniform float uRotate;      // 1 = sheet turned to portrait
uniform vec4 uSeg[MAX_CREASES];   // a.xy, b.xy
uniform vec4 uInfo[MAX_CREASES];  // kind, strength, fadeA, fadeB
uniform int uCount;

uniform vec3 uPaper;
uniform vec3 uBg;
uniform vec3 uLight;        // screen space, normalised
uniform float uSeed;

uniform float uDepth;       // how much the sheet still bends at each crease
uniform float uSpread;      // how far that bend reaches (sheet units)
uniform float uSharp;       // width of the crease itself (sheet units)
uniform float uLine;        // darkening of broken fibres on the crease
uniform float uContrast;    // light contrast
uniform float uWarp;        // the sheet not lying perfectly flat
uniform float uGrain;
uniform float uFibre;
uniform float uStrength;    // 1 = full paper effect, 0 = plain paper colour
uniform float uDebug;       // 1 = draw the crease map in red on top

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}

float fibres(vec2 p) {
  float f = 0.0;
  for (int i = 0; i < 3; i++) {
    float a = float(i) * 2.1 + uSeed;
    vec2 q = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
    float n = noise(vec2(q.x * 26.0, q.y * 420.0) + float(i) * 13.7 + uSeed);
    f += smoothstep(0.74, 0.97, n);
  }
  return f / 3.0;
}

float sdBox(vec2 p, vec2 h) {
  vec2 d = abs(p) - h;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  // Screen position in pixels, centred, y up.
  vec2 s = gl_FragCoord.xy - 0.5 * uRes;

  // Sheet size as it appears on screen (turned when portrait).
  vec2 sheetOnScreen = mix(uSheet, uSheet.yx, uRotate);
  float cover = max(uRes.x / sheetOnScreen.x, uRes.y / sheetOnScreen.y);
  float contain = min(uRes.x / sheetOnScreen.x, uRes.y / sheetOnScreen.y)
    * (1.0 - 2.0 * uMargin);
  float scale = mix(cover, contain, uFit);   // pixels per sheet unit
  float px = 1.0 / scale;                    // one pixel in sheet units

  vec2 ps = s / scale;                       // sheet units, screen frame
  // Into the sheet's own frame.
  vec2 p = mix(ps, vec2(-ps.y, ps.x), uRotate);

  // ---- height gradient (sheet frame) ----
  vec2 grad = vec2(0.0);
  float line = 0.0;
  float sharp = max(uSharp, 0.8 * px);

  for (int i = 0; i < MAX_CREASES; i++) {
    if (i >= uCount) break;
    vec2 a = uSeg[i].xy;
    vec2 b = uSeg[i].zw;
    vec4 info = uInfo[i];
    vec2 ab = b - a;
    float len = length(ab);
    float along = dot(p - a, ab) / len;
    float t = clamp(along / len, 0.0, 1.0);
    vec2 v = p - (a + ab * t);
    float d = length(v);
    vec2 dir = v / max(d, 1e-6);

    // Creases that stop mid-sheet fade out towards their end.
    float taper = 1.0;
    taper *= mix(1.0, smoothstep(0.0, 0.06, along), info.z);
    taper *= mix(1.0, smoothstep(0.0, 0.06, len - along), info.w);
    // Past a square end the crease simply stops.
    taper *= 1.0 - step(len + sharp, along) - step(along, -sharp);

    float k = info.x * info.y * taper;
    // Height h(d) = k * (depth * e^(-d/spread) + 0.35 * depth * e^(-d/sharp)).
    // Its slope points away from the crease line.
    float slope = uDepth * (exp(-d / uSpread) / uSpread * 0.04 + 0.35 * exp(-d / sharp) / sharp * 0.004);
    grad += -k * slope * dir;

    float lw = exp(-d / (sharp * 0.6)) * info.y * taper;
    line += lw * mix(0.55, 1.0, step(info.x, 0.0)); // valleys read darker
  }

  // The sheet doesn't lie perfectly flat.
  vec2 wq = p * 2.2 + uSeed;
  float e = 0.01;
  float w0 = fbm(wq);
  grad += uWarp * vec2(fbm(wq + vec2(e, 0.0)) - w0, fbm(wq + vec2(0.0, e)) - w0) / e * 0.02;

  // Back to the screen frame, where the light lives.
  vec2 gs = mix(grad, vec2(grad.y, -grad.x), uRotate);
  vec3 n = normalize(vec3(-gs, 1.0));

  float lambert = dot(n, uLight);
  float shade = 1.0 + (lambert - uLight.z) * uContrast;

  // ---- surface ----
  vec3 col = uPaper * shade;
  float g = noise(p * 520.0 + uSeed) * 0.6 + noise(p * 140.0 - uSeed) * 0.4;
  col *= 1.0 - uGrain * (g - 0.5);
  col *= 1.0 - uFibre * (fibres(p) - 0.15) * 0.5;
  float lineBreak = 0.6 + 0.4 * noise(p * 300.0);
  col *= 1.0 - uLine * clamp(line, 0.0, 1.0) * lineBreak;

  // Softer when it sits behind content.
  col = mix(uPaper, col, uStrength);

  // ---- sheet edge and shadow (only visible when contained) ----
  vec2 halfSize = uSheet * 0.5;
  float sd = sdBox(p, halfSize);
  float inside = 1.0 - smoothstep(-px, px, sd);
  vec2 shOff = mix(vec2(-0.004, 0.008), vec2(-0.008, -0.004), uRotate);
  float shd = sdBox(p + shOff, halfSize);
  float shadow = 0.22 * exp(-max(shd, 0.0) / 0.025) * (1.0 - step(shd, -0.02));
  vec3 bg = uBg * (1.0 - shadow);
  col = mix(bg, col, inside);

  // Debug: crease map.
  col = mix(col, vec3(0.9, 0.19, 0.13), uDebug * clamp(line * 2.0, 0.0, 1.0));

  // Dither to avoid banding in the soft gradients.
  col += (hash12(gl_FragCoord.xy + uSeed) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
