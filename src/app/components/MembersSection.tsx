import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

const members = [
  {
    name: 'レオ',
    role: 'Product Designer',
    description: 'UIデザインとブランディングを担当。ユーザー体験を第一に考え、シンプルで使いやすいデザインを追求しています。',
    initial: 'L'
  },
  {
    name: 'りょう',
    role: 'Lead Engineer',
    description: 'AI技術とフルスタック開発を担当。最新技術を駆使し、実用的なプロダクトの実装を推進しています。',
    initial: 'R'
  },
  {
    name: 'なごみ',
    role: 'Business Developer',
    description: 'ビジネス戦略と市場分析を担当。ペット業界の知見を活かし、事業の成長をリードしています。',
    initial: 'N'
  }
];

export function MembersSection() {
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

      const memberCards = sectionRef.current?.querySelectorAll('.member-card');
      memberCards?.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
          y: 100,
          opacity: 0,
          delay: index * 0.1,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="members" className="relative py-32 px-6 lg:px-12 overflow-hidden bg-secondary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1666392420593-5d04ba140113?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWV0YWxsaWMlMjB0ZXh0dXJlfGVufDF8fHx8MTc2NzEwMDQwOXww&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Dark metallic texture"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      
      {/* Secondary Background Overlay with Gradient */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-secondary via-secondary/95 to-secondary"></div>
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-secondary/80"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-32 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 lg:mb-8 text-muted-foreground">
            Team Members
          </p>
          <h2 
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            Our
            <br />
            <span className="italic">Creators</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {members.map((member, index) => (
            <div key={index} className="member-card group">
              <div className="mb-6 lg:mb-8 aspect-square bg-gradient-to-br from-accent/5 via-white/5 to-accent/10 backdrop-blur-sm border border-accent/20 flex items-center justify-center overflow-hidden relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-6 lg:w-8 h-6 lg:h-8 border-t-2 border-l-2 border-accent/40"></div>
                <div className="absolute top-0 right-0 w-6 lg:w-8 h-6 lg:h-8 border-t-2 border-r-2 border-accent/40"></div>
                <div className="absolute bottom-0 left-0 w-6 lg:w-8 h-6 lg:h-8 border-b-2 border-l-2 border-accent/40"></div>
                <div className="absolute bottom-0 right-0 w-6 lg:w-8 h-6 lg:h-8 border-b-2 border-r-2 border-accent/40"></div>
                
                <span 
                  style={{ fontFamily: 'UnifrakturMaguntia, serif' }}
                  className="text-[8rem] lg:text-[10rem] text-accent/40 group-hover:text-accent/60 transition-all duration-700 group-hover:scale-110"
                >
                  {member.initial}
                </span>
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <h3 
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="text-[clamp(1.75rem,3vw,2.5rem)] mb-2 leading-tight"
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs tracking-[0.2em] uppercase text-accent">
                    {member.role}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}