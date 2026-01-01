/**
 * Fluid Background React Component
 * Wrapper for FluidSimulation with React lifecycle management
 */

import { useEffect, useRef, useState } from 'react';
import { FluidSimulation } from './FluidSimulation';
import type { QualityPreset } from './utils/deviceDetection';
import {
  detectDeviceQuality,
  prefersReducedMotion,
} from './utils/deviceDetection';
import { checkWebGLSupport } from './utils/webglSupport';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export interface FluidBackgroundProps {
  /**
   * GSAP timeline progress (0-1)
   * Controls the fluid animation state
   */
  animationProgress?: number;

  /**
   * Quality preset
   * 'auto' will detect device capabilities
   */
  quality?: 'auto' | QualityPreset;

  /**
   * Fallback image URL if WebGL is not supported
   */
  fallbackImage?: string;

  /**
   * Callback when simulation is ready
   */
  onLoadComplete?: () => void;

  /**
   * Callback when simulation fails to initialize
   */
  onError?: (error: Error) => void;
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({
  animationProgress = 0,
  quality = 'auto',
  fallbackImage,
  onLoadComplete,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<FluidSimulation | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Initialize simulation on mount
  useEffect(() => {
    // Check for reduced motion preference
    if (prefersReducedMotion()) {
      console.log('User prefers reduced motion, skipping fluid simulation');
      return;
    }

    // Check WebGL support
    if (!checkWebGLSupport()) {
      console.warn('WebGL is not supported');
      setIsWebGLSupported(false);
      onError?.(new Error('WebGL not supported'));
      return;
    }

    // Ensure container exists
    if (!containerRef.current) {
      console.error('Container ref is null');
      return;
    }

    // Wait for container to have actual size
    const checkSize = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        setTimeout(checkSize, 100);
        return;
      }

      try {
        // Determine quality preset
        const qualityPreset = quality === 'auto' ? detectDeviceQuality() : quality;

        // Create simulation
        simulationRef.current = new FluidSimulation(
          containerRef.current,
          qualityPreset
        );

        // Notify completion
        onLoadComplete?.();
      } catch (error) {
        console.error('Failed to initialize FluidSimulation:', error);
        setHasError(true);
        onError?.(error as Error);
      }
    };

    // Start size check
    checkSize();

    // Cleanup on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.dispose();
        simulationRef.current = null;
      }
    };
  }, []); // Empty dependency array - initialize once

  // Update animation progress
  useEffect(() => {
    if (simulationRef.current) {
      simulationRef.current.setAnimationProgress(animationProgress);
    }
  }, [animationProgress]);

  // Show fallback if WebGL is not supported or error occurred
  if (!isWebGLSupported || hasError) {
    if (fallbackImage) {
      return (
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={fallbackImage}
            alt="Liquid metal 3D blob with chrome material"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Simple gradient fallback
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{
        width: '100%',
        height: '100%',
      }}
      aria-hidden="true"
    />
  );
};

// Named export for use with React.lazy()
export default FluidBackground;
