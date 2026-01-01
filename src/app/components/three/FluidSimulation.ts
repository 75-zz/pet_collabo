/**
 * Fluid Simulation using Three.js
 * Core class handling scene setup, particle system, and animation
 */

import * as THREE from 'three';
import type { QualityPreset, QualitySettings } from './utils/deviceDetection';
import { getQualitySettings, PerformanceMonitor } from './utils/deviceDetection';
import vertexShader from './shaders/raymarchVertex.glsl';
import fragmentShader from './shaders/raymarchFragment.glsl';

export class FluidSimulation {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private raymarchQuad: THREE.Mesh | null = null;
  private matcapTexture: THREE.Texture | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private clock: THREE.Clock;
  private animationId: number | null = null;
  private quality: QualitySettings;
  private performanceMonitor: PerformanceMonitor;
  private lastFrameTime = 0;
  private isPaused = false;
  private intersectionObserver: IntersectionObserver | null = null;

  // Animation state
  private animationProgress = 0;
  private mousePosition = new THREE.Vector2(0, 0);

  constructor(container: HTMLElement, qualityPreset: QualityPreset = 'medium') {
    this.container = container;
    this.quality = getQualitySettings(qualityPreset);
    this.clock = new THREE.Clock();
    this.performanceMonitor = new PerformanceMonitor();

    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();

    // Setup raymarch system (async)
    this.createRaymarchSystem();

    // Setup event listeners
    this.setupEventListeners();

    // Setup intersection observer for pausing when out of view
    this.setupIntersectionObserver();

    // Start animation loop
    this.animate();

  }

  /**
   * Create orthographic camera for raymarching fullscreen quad
   */
  private createCamera(): THREE.OrthographicCamera {
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.set(0, 0, 1);
    return camera;
  }

  /**
   * Create WebGL renderer
   */
  private createRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,  // Enable antialiasing for smooth edges
      powerPreference: 'high-performance',
      stencil: false,  // Disable stencil buffer
      depth: false,  // Disable depth buffer for 2D raymarch
    });

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Apply render scale for performance
    renderer.setSize(width * this.quality.renderScale, height * this.quality.renderScale, false);
    renderer.setPixelRatio(1);  // Set to 1 and control via renderScale
    renderer.setClearColor(0x000000, 0); // Transparent background

    // Force canvas style
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.zIndex = '1';

    this.container.appendChild(renderer.domElement);

    // Setup context lost/restored handlers
    renderer.domElement.addEventListener('webglcontextlost', this.onContextLost.bind(this));
    renderer.domElement.addEventListener('webglcontextrestored', this.onContextRestored.bind(this));

    return renderer;
  }


  /**
   * Load or generate Matcap texture
   */
  private async loadMatcapTexture(): Promise<THREE.Texture> {
    // Try to load matcap texture (will fail gracefully if not found)
    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        '/assets/matcap_chrome.png',
        (texture) => {
          texture.minFilter = THREE.LinearMipMapLinearFilter;
          texture.generateMipmaps = true;
          console.log('Matcap texture loaded successfully');
          resolve(texture);
        },
        undefined,
        () => {
          console.warn('Matcap texture not found, using procedural generation');
          resolve(this.generateProceduralMatcap());
        }
      );
    });
  }

  /**
   * Generate procedural Matcap texture as fallback
   */
  private generateProceduralMatcap(): THREE.Texture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Radial gradient for sphere lighting
    const gradient = ctx.createRadialGradient(
      size * 0.4, size * 0.4, size * 0.1,  // Inner (highlight)
      size * 0.5, size * 0.5, size * 0.7   // Outer (shadow)
    );

    gradient.addColorStop(0, '#ffffff');   // Bright highlight
    gradient.addColorStop(0.3, '#e0e0e0'); // Mid-tone
    gradient.addColorStop(0.7, '#606060'); // Shadow
    gradient.addColorStop(1, '#202020');   // Dark edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    console.log('Procedural Matcap texture generated');
    return texture;
  }

  /**
   * Create raymarch system with fullscreen quad
   */
  private async createRaymarchSystem(): Promise<void> {
    // Load Matcap texture
    this.matcapTexture = await this.loadMatcapTexture();

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Create fullscreen quad geometry (NDC coordinates)
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Create shader material for raymarching
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uCameraPosition: { value: this.camera.position },
        uMatcapTexture: { value: this.matcapTexture },
        uMaxSteps: { value: this.quality.raySteps },
        uNumMetaballs: { value: this.quality.metaballCount },
        uUseFastNormals: { value: this.quality.useFastNormals },
        uMouse: { value: this.mousePosition },
      },
      transparent: true,
      depthWrite: false,
    });

    // Create mesh with fullscreen quad
    this.raymarchQuad = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.raymarchQuad);
  }

  /**
   * Animation loop with FPS throttling
   */
  private animate = (): void => {
    if (this.isPaused) {
      this.animationId = requestAnimationFrame(this.animate);
      return;
    }

    const now = performance.now();
    const frameInterval = 1000 / this.quality.targetFPS;
    const delta = now - this.lastFrameTime;

    if (delta > frameInterval) {
      this.lastFrameTime = now - (delta % frameInterval);

      // Update simulation
      this.update();

      // Render scene
      this.renderer.render(this.scene, this.camera);

      // Record performance
      this.performanceMonitor.recordFrame();
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Update simulation state
   */
  private update(): void {
    if (!this.material) return;

    const elapsedTime = this.clock.getElapsedTime();

    // Update shader uniforms
    this.material.uniforms.uTime.value = elapsedTime;
    this.material.uniforms.uProgress.value = this.animationProgress;
    this.material.uniforms.uCameraPosition.value.copy(this.camera.position);

    // Adaptive quality adjustment
    if (this.performanceMonitor.shouldReduceQuality()) {
      this.reduceRaymarchQuality();
    }
  }

  /**
   * Reduce raymarch quality for better performance
   */
  private reduceRaymarchQuality(): void {
    if (!this.material) return;
    const currentSteps = this.material.uniforms.uMaxSteps.value;
    this.material.uniforms.uMaxSteps.value = Math.max(16, Math.floor(currentSteps * 0.75));
    console.warn('Reducing ray steps to:', this.material.uniforms.uMaxSteps.value);
  }

  /**
   * Set animation progress from GSAP timeline (0-1)
   */
  public setAnimationProgress(progress: number): void {
    this.animationProgress = Math.max(0, Math.min(1, progress));
    // uProgress is updated in the update() method
  }

  /**
   * Handle window resize
   */
  private onWindowResize = (): void => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    // Orthographic camera doesn't need aspect ratio update
    // Apply render scale for performance
    this.renderer.setSize(width * this.quality.renderScale, height * this.quality.renderScale, false);

    if (this.material) {
      this.material.uniforms.uResolution.value.set(width, height);
    }
  };

  /**
   * Handle WebGL context lost
   */
  private onContextLost(event: Event): void {
    event.preventDefault();
    console.warn('WebGL context lost, attempting recovery...');

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Handle WebGL context restored
   */
  private onContextRestored(): void {
    console.log('WebGL context restored');
    this.reinitializeScene();
  }

  /**
   * Reinitialize scene after context loss
   */
  private reinitializeScene(): void {
    // Clear existing raymarch quad
    if (this.raymarchQuad) {
      this.scene.remove(this.raymarchQuad);
      this.raymarchQuad = null;
    }

    // Recreate raymarch system
    this.createRaymarchSystem();

    // Restart animation
    if (!this.animationId) {
      this.animate();
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  /**
   * Handle mouse move
   */
  private onMouseMove = (event: MouseEvent): void => {
    // Convert to normalized device coordinates (-1 to +1)
    this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  /**
   * Setup intersection observer to pause when not visible
   */
  private setupIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.resume();
          } else {
            this.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(this.container);
  }

  /**
   * Pause animation
   */
  public pause(): void {
    this.isPaused = true;
    this.clock.stop();
  }

  /**
   * Resume animation
   */
  public resume(): void {
    this.isPaused = false;
    this.clock.start();
  }

  /**
   * Get current FPS
   */
  public getFPS(): number {
    return this.performanceMonitor.getAverageFPS();
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    // Stop animation
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);

    // Disconnect intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    // Dispose raymarch quad
    if (this.raymarchQuad) {
      this.raymarchQuad.geometry.dispose();

      // Dispose material
      if (this.material) {
        this.material.dispose();
      }

      this.scene.remove(this.raymarchQuad);
    }

    // Dispose matcap texture
    if (this.matcapTexture) {
      this.matcapTexture.dispose();
    }

    // Dispose renderer
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer.domElement.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.renderer.dispose();

    // Remove canvas from DOM
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }

    // Clear scene
    this.scene.clear();
  }
}
