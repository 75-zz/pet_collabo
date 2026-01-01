import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Lazy load FluidBackground for code splitting
const FluidBackground = lazy(() => import('./three/FluidBackground'));

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Track GSAP animation progress for Three.js synchronization
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onUpdate: () => {
          // Sync Three.js animation with GSAP timeline
          setAnimationProgress(tl.progress());
        },
      });

      if (taglineRef.current) {
        tl.from(taglineRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      }
      
      if (titleRef.current) {
        tl.from(titleRef.current, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        }, '-=0.8');
      }
      
      if (descRef.current) {
        tl.from(descRef.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.8');
      }
      
      if (ctaRef.current) {
        tl.from(ctaRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, '-=0.6');
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Three.js Fluid Background */}
      <Suspense fallback={null}>
        <FluidBackground
          animationProgress={animationProgress}
          quality="auto"
        />
      </Suspense>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center px-6 lg:px-12" style={{ isolation: 'isolate' }}>
        <div className="max-w-6xl mx-auto text-center" style={{ mixBlendMode: 'difference', color: 'white' }}>
          <div ref={taglineRef} className="mb-8 lg:mb-12">
            <p className="text-xs lg:text-sm tracking-[0.15em] lg:tracking-[0.25em] uppercase text-white">
              AI Technology × Multi-Field Development
            </p>
          </div>

          <h1
            ref={titleRef}
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tight text-white mb-12 lg:mb-20"
          >
            Pet
            <br />
            <span className="italic">Collabo</span>
          </h1>

          <div ref={descRef} className="max-w-2xl mx-auto">
            <p className="text-white text-sm lg:text-base leading-relaxed mb-12 lg:mb-16 px-4">
              AI技術を活用した多分野開発事業。ペット業界から不動産まで、
              <br className="hidden sm:block" />
              幅広い領域で革新的なソリューションを創造します。
            </p>
          </div>

          <div ref={ctaRef}>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 lg:px-12 py-4 lg:py-5 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 text-xs lg:text-sm tracking-[0.2em] lg:tracking-[0.3em] uppercase hover:scale-105"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}