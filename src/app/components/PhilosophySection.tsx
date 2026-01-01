import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
          y: 100,
          opacity: 0,
        });
      }

      if (itemsRef.current?.children) {
        gsap.from(itemsRef.current.children, {
          scrollTrigger: {
            trigger: itemsRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          stagger: 0.2,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="philosophy" className="relative py-32 px-6 lg:px-12 overflow-hidden bg-secondary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1739056238818-d00d80f0f842?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXF1aWQlMjBtZXRhbCUyMGNocm9tZSUyMGFic3RyYWN0fGVufDF8fHx8MTc2NzA5OTAyNnww&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Abstract chrome gradient"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-secondary/90"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div ref={titleRef}>
            <p className="text-xs tracking-[0.3em] uppercase mb-6 lg:mb-8 text-muted-foreground">
              Our Definition
            </p>
            <h2 
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
            >
              Philosophy of
              <br />
              <span className="italic">Collaboration</span>
            </h2>
          </div>
          
          <div ref={itemsRef} className="space-y-8 lg:space-y-12 md:pt-20">
            <div className="border-l-2 border-accent pl-6 lg:pl-8">
              <h3 className="text-xl lg:text-2xl mb-3 lg:mb-4 tracking-wide">AI技術の実用化</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                最新のAI技術を、実際のビジネス課題に適用。
                理論だけでなく、現場で本当に役立つソリューションを提供することを重視しています。
              </p>
            </div>
            
            <div className="border-l-2 border-accent pl-6 lg:pl-8">
              <h3 className="text-xl lg:text-2xl mb-3 lg:mb-4 tracking-wide">多様な分野への挑戦</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                一つの業界に縛られず、様々な分野でAIの可能性を追求。
                ペット業界から不動産まで、幅広い領域で価値を創造します。
              </p>
            </div>
            
            <div className="border-l-2 border-accent pl-6 lg:pl-8">
              <h3 className="text-xl lg:text-2xl mb-3 lg:mb-4 tracking-wide">協働による革新</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                デザイン、エンジニアリング、ビジネスの専門性を融合。
                3人のクリエイターによる協働が、独自の価値を生み出します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}