// Vertex Shader for Fluid Simulation Particles
// Handles particle position updates using curl noise

uniform float uTime;           // Time for animation
uniform float uProgress;       // GSAP timeline progress (0-1)
uniform float uCurlStrength;   // Strength of curl noise effect
uniform float uSpeed;          // Overall animation speed
uniform vec2 uResolution;      // Screen resolution for responsive scaling

varying vec3 vPosition;        // Pass position to fragment shader
varying vec3 vNormal;          // Pass normal for lighting
varying float vDepth;          // Depth for fog/fade effects

// === Curl Noise Functions ===

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

// === End Curl Noise Functions ===

void main() {
  // Get original particle position from instance matrix
  vec3 pos = position;
  vec3 instancePos = vec3(
    instanceMatrix[3][0],
    instanceMatrix[3][1],
    instanceMatrix[3][2]
  );

  // Combine base position with instance offset
  vec3 particlePos = pos + instancePos;

  // Apply curl noise for fluid motion
  float timeOffset = uTime * uSpeed;
  vec3 noiseVec = curlNoise(
    particlePos,
    timeOffset,
    0.5 + uProgress * 0.5,  // Scale increases with progress
    uCurlStrength
  );

  // Apply noise displacement
  particlePos += noiseVec * (1.0 + uProgress);

  // Add gentle rotation based on progress
  float rotationAngle = uProgress * 0.5;
  float cosRot = cos(rotationAngle);
  float sinRot = sin(rotationAngle);

  // Rotate around Y axis
  vec3 rotated = vec3(
    particlePos.x * cosRot - particlePos.z * sinRot,
    particlePos.y,
    particlePos.x * sinRot + particlePos.z * cosRot
  );

  // Apply vertical wave motion
  float wave = sin(rotated.x * 0.5 + uTime * 0.3) * cos(rotated.z * 0.5 + uTime * 0.2);
  rotated.y += wave * 0.3 * (1.0 - uProgress * 0.5);

  // Calculate model-view-projection matrix
  vec4 mvPosition = modelViewMatrix * vec4(rotated, 1.0);

  // Output position
  gl_Position = projectionMatrix * mvPosition;

  // Calculate particle size based on depth and progress
  float particleSize = 3.0 + uProgress * 2.0;

  // Responsive sizing based on resolution
  float responsiveSize = particleSize * (uResolution.y / 1080.0);

  // Apply depth-based size scaling (closer = larger)
  gl_PointSize = responsiveSize * (300.0 / -mvPosition.z);

  // Pass variables to fragment shader
  vPosition = rotated;
  vNormal = normalize(normalMatrix * normal);
  vDepth = -mvPosition.z / 50.0; // Normalize depth for fade effects
}
