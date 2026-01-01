/**
 * Device Detection and Quality Preset Utility
 * Determines optimal performance settings based on device capabilities
 */

export type QualityPreset = 'low' | 'medium' | 'high';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface QualitySettings {
  metaballCount: number;       // Number of metaballs for raymarching
  raySteps: number;            // Max raymarching iterations
  useFastNormals: boolean;     // Use tetrahedron method (mobile) vs central diff (desktop)
  targetFPS: number;
  shaderPrecision: 'lowp' | 'mediump' | 'highp';
  noiseOctaves: number;
  renderScale: number;
  enablePostProcessing: boolean;
  cullDistance: number;
  updateFrequency: number; // Update every N frames
}

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  gpuTier: 'low' | 'medium' | 'high';
  userAgent: string;
}

/**
 * Detect device type
 */
export function detectDeviceType(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  // Check for mobile devices
  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);

  // Check for tablets
  const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(ua);

  if (isMobileUA && width < 768) {
    return 'mobile';
  }

  if (isTabletUA || (width >= 768 && width < 1024)) {
    return 'tablet';
  }

  return 'desktop';
}

/**
 * Detect GPU tier based on available information
 */
export function detectGPUTier(): 'low' | 'medium' | 'high' {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) return 'low';

  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return 'medium';

  const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();

  // High-end GPUs (NVIDIA RTX, AMD RX, Apple M1/M2, etc.)
  if (
    /nvidia.*rtx|nvidia.*gtx (1[0-9]|2[0-9]|3[0-9]|4[0-9])/i.test(renderer) ||
    /amd.*rx (5[0-9]|6[0-9]|7[0-9])/i.test(renderer) ||
    /apple m[1-9]/i.test(renderer) ||
    /intel.*iris.*xe/i.test(renderer)
  ) {
    return 'high';
  }

  // Low-end GPUs (Integrated graphics, old hardware)
  if (
    /intel.*hd|intel.*uhd [0-9]{3}$/i.test(renderer) ||
    /mali|adreno [0-5][0-9]{2}|powervr/i.test(renderer) ||
    /nvidia.*mx[0-9]{3}/i.test(renderer)
  ) {
    return 'low';
  }

  // Default to medium
  return 'medium';
}

/**
 * Get comprehensive device information
 */
export function getDeviceInfo(): DeviceInfo {
  const deviceType = detectDeviceType();
  const gpuTier = detectGPUTier();

  return {
    type: deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    gpuTier,
    userAgent: navigator.userAgent,
  };
}

/**
 * Get quality settings for a specific preset
 */
export function getQualitySettings(preset: QualityPreset): QualitySettings {
  switch (preset) {
    case 'high':
      return {
        metaballCount: 12,
        raySteps: 48,  // Reduced from 64 for better performance
        useFastNormals: false,
        targetFPS: 60,
        shaderPrecision: 'highp',
        noiseOctaves: 4,
        renderScale: 0.8,  // Slightly reduced resolution for performance
        enablePostProcessing: true,
        cullDistance: 25,
        updateFrequency: 1,
      };

    case 'medium':
      return {
        metaballCount: 6,  // Reduced from 8
        raySteps: 32,  // Reduced from 48 for better performance
        useFastNormals: true,  // Use fast normals for medium devices
        targetFPS: 60,
        shaderPrecision: 'mediump',
        noiseOctaves: 3,
        renderScale: 0.75,  // Reduced resolution
        enablePostProcessing: false,
        cullDistance: 20,
        updateFrequency: 1,
      };

    case 'low':
      return {
        metaballCount: 5,
        raySteps: 32,
        useFastNormals: true,  // Mobile uses fast tetrahedron method
        targetFPS: 30,
        shaderPrecision: 'mediump',
        noiseOctaves: 2,
        renderScale: 0.7,      // 70% resolution for better quality on mobile
        enablePostProcessing: false,
        cullDistance: 15,
        updateFrequency: 2,
      };

    default:
      return getQualitySettings('medium');
  }
}

/**
 * Automatically detect optimal quality preset
 */
export function detectDeviceQuality(): QualityPreset {
  const deviceInfo = getDeviceInfo();

  // Desktop with high-end GPU
  if (deviceInfo.isDesktop && deviceInfo.gpuTier === 'high') {
    return 'high';
  }

  // Desktop with medium GPU or tablet with high GPU
  if (
    (deviceInfo.isDesktop && deviceInfo.gpuTier === 'medium') ||
    (deviceInfo.isTablet && deviceInfo.gpuTier === 'high')
  ) {
    return 'medium';
  }

  // Mobile devices or low-end hardware
  if (deviceInfo.isMobile || deviceInfo.gpuTier === 'low') {
    return 'low';
  }

  // Tablets and other devices default to medium
  return 'medium';
}

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Check if device is in power saving mode (battery)
 */
export function isLowPowerMode(): boolean {
  // Check battery API if available
  if ('getBattery' in navigator) {
    (navigator as any).getBattery().then((battery: any) => {
      return battery.level < 0.2; // Low battery
    });
  }

  return false;
}

/**
 * Log device information for debugging
 */
export function logDeviceInfo(): void {
  const deviceInfo = getDeviceInfo();
  const quality = detectDeviceQuality();
  const settings = getQualitySettings(quality);

  console.log('Device Information:', {
    type: deviceInfo.type,
    gpu: deviceInfo.gpuTier,
    screen: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
    pixelRatio: deviceInfo.pixelRatio,
    recommendedQuality: quality,
    particleCount: settings.particleCount,
    targetFPS: settings.targetFPS,
    prefersReducedMotion: prefersReducedMotion(),
  });
}

/**
 * Performance monitor for adaptive quality
 */
export class PerformanceMonitor {
  private fpsHistory: number[] = [];
  private readonly sampleSize = 60; // 1 second at 60fps
  private lastFrameTime = performance.now();

  recordFrame(): void {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      this.fpsHistory.push(fps);

      if (this.fpsHistory.length > this.sampleSize) {
        this.fpsHistory.shift();
      }
    }
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;

    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return sum / this.fpsHistory.length;
  }

  shouldReduceQuality(threshold = 25): boolean {
    return (
      this.getAverageFPS() < threshold &&
      this.fpsHistory.length >= this.sampleSize
    );
  }

  shouldIncreaseQuality(threshold = 55): boolean {
    return (
      this.getAverageFPS() > threshold &&
      this.fpsHistory.length >= this.sampleSize
    );
  }

  reset(): void {
    this.fpsHistory = [];
    this.lastFrameTime = performance.now();
  }
}
