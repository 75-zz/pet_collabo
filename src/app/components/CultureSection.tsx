import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    title: 'AI技術への情熱',
    description: '最新のAI技術に常にアンテナを張り、実用化への道を探求。技術革新への好奇心で結ばれたチームです。'
  },
  {
    title: '自律的な働き方',
    description: 'リモートワーク中心で、場所や時間に縛られない柔軟な環境。それぞれが最高のパフォーマンスを発揮できます。'
  },
  {
    title: '実用性重視',
    description: '技術のための技術ではなく、実際のビジネス課題を解決するソリューションを追求。成果にこだわります。'
  },
  {
    title: '多分野への挑戦',
    description: '一つの業界に留まらず、様々な分野での可能性を探る。失敗を恐れず、新しい領域に挑戦する文化です。'
  }
];

export function CultureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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

      const benefitItems = sectionRef.current?.querySelectorAll('.benefit-item');
      benefitItems?.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          delay: index * 0.1,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 lg:px-12 overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1644318295821-12c4ddf2a36e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xvZ3JhcGhpYyUyMGlyaWRlc2NlbnQlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NjcwOTkwMjh8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Holographic iridescent surface"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-white/85 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-32">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 lg:mb-8 text-muted-foreground">
            Our Culture & Benefit
          </p>
          <h2 
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[clamp(2rem,7vw,6rem)] leading-[0.95] tracking-tight max-w-4xl"
          >
            Working at
            <br />
            <span className="italic">Pet Collabo</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12 lg:gap-y-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item border-t border-black/10 pt-8 lg:pt-10">
              <div className="flex items-baseline gap-4 lg:gap-6 mb-4 lg:mb-6">
                <span className="text-[2.5rem] lg:text-[3rem] text-muted-foreground/20 leading-none" style={{ fontFamily: 'var(--font-serif)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[clamp(1.25rem,3vw,2rem)] tracking-wide">{benefit.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm pl-14 lg:pl-20">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}