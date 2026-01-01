/**
 * WebGL Support Detection Utility
 * Checks for WebGL capabilities and required extensions
 */

export interface WebGLCapabilities {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  maxVertexUniforms: number;
  supportedExtensions: string[];
  renderer: string;
  vendor: string;
}

/**
 * Check if WebGL is supported
 */
export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Check if WebGL 2.0 is supported
 */
export function checkWebGL2Support(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return !!gl;
  } catch (e) {
    return false;
  }
}

/**
 * Get detailed WebGL capabilities
 */
export function getWebGLCapabilities(): WebGLCapabilities | null {
  const canvas = document.createElement('canvas');
  const gl = (canvas.getContext('webgl2') ||
               canvas.getContext('webgl') ||
               canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

  if (!gl) {
    return null;
  }

  // Get supported extensions
  const supportedExtensions = gl.getSupportedExtensions() || [];

  // Get renderer info
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : 'Unknown';
  const vendor = debugInfo
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
    : 'Unknown';

  return {
    hasWebGL: true,
    hasWebGL2: !!canvas.getContext('webgl2'),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    supportedExtensions,
    renderer,
    vendor,
  };
}

/**
 * Check if floating point textures are supported
 * Required for some advanced effects
 */
export function checkFloatTextureSupport(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) return false;

  if (canvas.getContext('webgl2')) {
    // WebGL2 has native float texture support
    return true;
  }

  // WebGL1 requires extension
  const ext = gl.getExtension('OES_texture_float');
  return !!ext;
}

/**
 * Determine shader precision support
 */
export function getShaderPrecisionSupport(): 'highp' | 'mediump' | 'lowp' {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

  if (!gl) return 'lowp';

  const fragmentShaderPrecision = gl.getShaderPrecisionFormat(
    gl.FRAGMENT_SHADER,
    gl.HIGH_FLOAT
  );

  if (fragmentShaderPrecision && fragmentShaderPrecision.precision > 0) {
    return 'highp';
  }

  const mediumPrecision = gl.getShaderPrecisionFormat(
    gl.FRAGMENT_SHADER,
    gl.MEDIUM_FLOAT
  );

  if (mediumPrecision && mediumPrecision.precision > 0) {
    return 'mediump';
  }

  return 'lowp';
}

/**
 * Log WebGL information for debugging
 */
export function logWebGLInfo(): void {
  const capabilities = getWebGLCapabilities();

  if (!capabilities) {
    console.warn('WebGL is not supported');
    return;
  }

  console.log('WebGL Capabilities:', {
    version: capabilities.hasWebGL2 ? '2.0' : '1.0',
    renderer: capabilities.renderer,
    vendor: capabilities.vendor,
    maxTextureSize: capabilities.maxTextureSize,
    maxVertexUniforms: capabilities.maxVertexUniforms,
    shaderPrecision: getShaderPrecisionSupport(),
    floatTextures: checkFloatTextureSupport(),
    extensionCount: capabilities.supportedExtensions.length,
  });
}
