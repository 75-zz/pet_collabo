// Raymarch Fragment Shader
// Metaballs with Matcap metal rendering

precision highp float;

// === UNIFORMS ===
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec3 uCameraPosition;
uniform sampler2D uMatcapTexture;
uniform int uMaxSteps;
uniform int uNumMetaballs;
uniform bool uUseFastNormals;
uniform vec2 uMouse; // Mouse position (-1 to 1)

// === VARYING ===
varying vec2 vUv;

// === CONSTANTS ===
const float MIN_DIST = 0.001;
const float MAX_DIST = 50.0;
const int MAX_METABALLS = 12;

// === NOISE FUNCTIONS (from curlNoise.glsl) ===

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p, float time, float scale, float strength) {
  float eps = 0.1;
  vec3 p1 = p + vec3(time * 0.1);
  p1 *= scale;

  float n1 = snoise(p1 + vec3(0.0, eps, 0.0));
  float n2 = snoise(p1 + vec3(0.0, -eps, 0.0));
  float n3 = snoise(p1 + vec3(eps, 0.0, 0.0));
  float n4 = snoise(p1 + vec3(-eps, 0.0, 0.0));
  float n5 = snoise(p1 + vec3(0.0, 0.0, eps));
  float n6 = snoise(p1 + vec3(0.0, 0.0, -eps));

  vec3 curl = vec3(
    (n1 - n2) - (n5 - n6),
    (n5 - n6) - (n3 - n4),
    (n3 - n4) - (n1 - n2)
  );

  return curl * strength;
}

// === SDF FUNCTIONS ===

float sdSphere(vec3 p, vec3 center, float radius) {
    return length(p - center) - radius;
}

// Smooth minimum for organic blending
float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}

// Get metaball position with curl noise animation - CENTERED & MOUSE REACTIVE
vec3 getMetaballPosition(int index, float time, float progress) {
    // Distribute metaballs in a tight cluster around center at z=-2
    float angle = float(index) * 2.39996323;
    float radius = 1.0 + sin(time * 0.3 + float(index)) * 0.35; // Even larger distribution

    vec3 basePos = vec3(
        cos(angle) * radius,
        sin(angle * 1.5) * radius * 0.5,
        -2.0 + sin(angle * 0.7) * radius * 0.2
    );

    // Mouse influence - gentle attraction
    vec3 mouseInfluence = vec3(uMouse.x * 0.3, uMouse.y * 0.3, 0.0);

    // Simplified noise for better performance
    float simpleNoise = sin(time * 0.2 + float(index)) * cos(time * 0.15 - float(index) * 0.5);
    vec3 noiseOffset = vec3(
        simpleNoise * 0.1,
        cos(time * 0.18 + float(index) * 0.7) * 0.1,
        0.0
    );

    // Very gentle pulsing
    float pulse = sin(time * 0.25 + float(index) * 0.3) * 0.08;

    return basePos + mouseInfluence + noiseOffset + vec3(0.0, pulse, 0.0);
}

float getMetaballRadius(int index, float progress) {
    float baseRadius = 1.3; // Even larger radius for bigger metaballs
    float pulse = sin(uTime * 0.3 + float(index) * 1.2) * 0.15;
    return baseRadius + pulse;
}

// Metaballs SDF with smooth blending - Optimized
float sdMetaballs(vec3 p) {
    float d = 1000.0;
    float blendStrength = 0.8; // Strong blending for unified liquid

    // Early exit if point is far from the cluster center
    if (length(p - vec3(0.0, 0.0, -2.0)) > 4.0) {
        return d;
    }

    for (int i = 0; i < MAX_METABALLS; i++) {
        if (i >= uNumMetaballs) break;

        vec3 center = getMetaballPosition(i, uTime, uProgress);
        float radius = getMetaballRadius(i, uProgress);
        float sphere = sdSphere(p, center, radius);
        d = smin(d, sphere, blendStrength);
    }

    return d;
}

// === RAYMARCHING ===

float raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;

    for (int i = 0; i < 64; i++) {
        if (i >= uMaxSteps) break;

        vec3 p = ro + rd * t;
        float d = sdMetaballs(p);

        if (d < MIN_DIST) return t;
        if (t > MAX_DIST) break;

        // Adaptive step size for performance
        t += d * 0.9;  // Slightly conservative stepping
    }

    return -1.0; // Miss
}

// === NORMAL CALCULATION ===

vec3 calcNormal(vec3 p) {
    if (uUseFastNormals) {
        // Tetrahedron method (mobile)
        const vec2 k = vec2(1, -1);
        return normalize(
            k.xyy * sdMetaballs(p + k.xyy * 0.001) +
            k.yyx * sdMetaballs(p + k.yyx * 0.001) +
            k.yxy * sdMetaballs(p + k.yxy * 0.001) +
            k.xxx * sdMetaballs(p + k.xxx * 0.001)
        );
    } else {
        // Central differences (desktop)
        const vec2 e = vec2(0.001, 0.0);
        return normalize(vec3(
            sdMetaballs(p + e.xyy) - sdMetaballs(p - e.xyy),
            sdMetaballs(p + e.yxy) - sdMetaballs(p - e.yxy),
            sdMetaballs(p + e.yyx) - sdMetaballs(p - e.yyx)
        ));
    }
}

// === MATCAP SHADING ===

vec3 getMatcapColor(vec3 normal) {
    // Convert normal to view space for matcap lookup
    vec2 matcapUV = normal.xy * 0.5 + 0.5;
    return texture2D(uMatcapTexture, matcapUV).rgb;
}

// Rainbow iridescent color - VIVID HOLOGRAPHIC
vec3 getIridescentColor(vec3 normal, vec3 viewDir, float time) {
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

    // Complex hue based on normal vector for holographic effect
    float hue = dot(normal, vec3(0.5, 0.3, 0.2)) * 0.5 + 0.5;
    hue += time * 0.03;
    hue += sin(normal.x * 5.0 + time * 0.4) * 0.15;
    hue += cos(normal.y * 4.0 - time * 0.3) * 0.15;
    hue = fract(hue);

    // Enhanced HSV to RGB with boosted saturation
    vec3 rainbow;
    float h = hue * 6.0;
    float c = 1.0;
    float x = 1.0 - abs(mod(h, 2.0) - 1.0);

    if (h < 1.0) rainbow = vec3(c, x, 0.0);       // Red to Yellow
    else if (h < 2.0) rainbow = vec3(x, c, 0.0);  // Yellow to Green
    else if (h < 3.0) rainbow = vec3(0.0, c, x);  // Green to Cyan
    else if (h < 4.0) rainbow = vec3(0.0, x, c);  // Cyan to Blue
    else if (h < 5.0) rainbow = vec3(x, 0.0, c);  // Blue to Magenta
    else rainbow = vec3(c, 0.0, x);               // Magenta to Red

    // Vivid saturation boost
    return rainbow * fresnel * 2.0;
}

// === MAIN ===

void main() {
    // Setup ray
    vec2 uv = (vUv - 0.5) * 2.0; // Convert [0,1] to [-1,1]
    uv.x *= uResolution.x / uResolution.y; // Aspect ratio correction

    vec3 ro = uCameraPosition; // Ray origin
    vec3 rd = normalize(vec3(uv, -1.0)); // Ray direction

    // Raymarch
    float t = raymarch(ro, rd);

    if (t < 0.0) {
        // Miss - transparent background
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    // Hit point
    vec3 p = ro + rd * t;
    vec3 normal = calcNormal(p);
    vec3 viewDir = normalize(uCameraPosition - p);

    // Base white/silver metallic from matcap
    vec3 baseColor = getMatcapColor(normal) * 0.3;

    // Vivid iridescent rainbow reflection
    vec3 iridescent = getIridescentColor(normal, viewDir, uTime);

    // Combine with strong iridescence
    vec3 color = baseColor + iridescent;

    // Strong specular highlight (white rim)
    float specular = pow(1.0 - max(0.0, dot(normal, viewDir)), 5.0);
    color += vec3(1.0) * specular * 0.8;

    // Slight depth fade for realism
    float fogFactor = exp(-t * 0.02);
    vec3 fogColor = vec3(1.0); // White background
    color = mix(fogColor, color, fogFactor);

    gl_FragColor = vec4(color, 1.0);
}
