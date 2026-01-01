// Fragment Shader for Liquid Metal Effect
// Creates metallic chrome appearance with PBR lighting

precision highp float;

uniform float uTime;
uniform float uProgress;
uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vDepth;

// Metallic color palette (chrome/silver tones)
const vec3 metalColor1 = vec3(0.95, 0.95, 0.98);  // Bright silver
const vec3 metalColor2 = vec3(0.70, 0.72, 0.75);  // Medium silver
const vec3 metalColor3 = vec3(0.85, 0.88, 0.92);  // Light chrome

void main() {
  // Circular point shape (smooth edges)
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);

  // Discard pixels outside circle
  if (dist > 0.5) {
    discard;
  }

  // Smooth edge anti-aliasing
  float edgeSoftness = 0.1;
  float alpha = 1.0 - smoothstep(0.5 - edgeSoftness, 0.5, dist);

  // Calculate view direction
  vec3 viewDir = normalize(uCameraPosition - vPosition);

  // Calculate light direction
  vec3 lightDir = normalize(uLightPosition - vPosition);

  // Normal for sphere-like particle
  vec3 normal = normalize(vec3(center * 2.0, sqrt(1.0 - dist * 4.0)));

  // Transform normal to world space
  vec3 worldNormal = normalize(vNormal + normal * 0.5);

  // Fresnel effect (metallic rim lighting)
  float fresnel = pow(1.0 - max(0.0, dot(worldNormal, viewDir)), 3.0);

  // Diffuse lighting
  float diffuse = max(0.0, dot(worldNormal, lightDir));

  // Specular lighting (metallic reflection)
  vec3 halfVector = normalize(lightDir + viewDir);
  float specular = pow(max(0.0, dot(worldNormal, halfVector)), 80.0);

  // Metallic color variation based on position and time
  float colorNoise = sin(vPosition.x * 0.5 + uTime * 0.2) *
                     cos(vPosition.y * 0.5 + uTime * 0.15) *
                     sin(vPosition.z * 0.5 + uTime * 0.25);
  colorNoise = colorNoise * 0.5 + 0.5; // Normalize to [0,1]

  // Blend metallic colors
  vec3 baseColor = mix(metalColor2, metalColor1, colorNoise);
  baseColor = mix(baseColor, metalColor3, fresnel);

  // Combine lighting components
  vec3 ambient = baseColor * 0.3;
  vec3 diffuseColor = baseColor * diffuse * 0.5;
  vec3 specularColor = vec3(1.0) * specular;

  vec3 finalColor = ambient + diffuseColor + specularColor;

  // Add subtle iridescence based on view angle
  float iridescence = sin(fresnel * 10.0 + uTime) * 0.1;
  finalColor += vec3(iridescence * 0.3, iridescence * 0.2, iridescence * 0.4);

  // Depth-based fog/fade
  float fogAmount = clamp(vDepth, 0.0, 1.0);
  vec3 fogColor = vec3(0.0);
  finalColor = mix(finalColor, fogColor, fogAmount * 0.3);

  // Brightness boost based on animation progress
  finalColor *= (0.8 + uProgress * 0.4);

  // Apply alpha with edge smoothing
  float finalAlpha = alpha * (0.7 + uProgress * 0.3);

  // Fade out distant particles
  finalAlpha *= (1.0 - fogAmount * 0.5);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
