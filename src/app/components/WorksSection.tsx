import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

const works = [
  {
    number: '01',
    title: '犬服着せ替えツール',
    description: 'AI画像生成技術を活用し、愛犬の写真に様々な衣装を試着させることができるツール。実際に購入する前にイメージを確認できます。',
    category: 'Pet Tech',
    status: '開発中',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjbG90aGVzfGVufDF8fHx8MTc2NzA5NTYyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    number: '02',
    title: 'AI×不動産関連事業',
    description: 'AI技術を活用した不動産業界向けの革新的なサービス開発。データ分析と自動化により、業界の効率化と新たな価値創造を目指します。',
    category: 'Real Estate Tech',
    status: '構想中',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwbW9kZXJufGVufDF8fHx8MTc2NzA5NTYyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function WorksSection() {
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

      const workItems = sectionRef.current?.querySelectorAll('.work-item');
      workItems?.forEach((item, index) => {
        const workContent = item.querySelector('.work-content');
        const workImage = item.querySelector('.work-image');
        
        if (workContent) {
          gsap.from(workContent, {
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1,
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
          });
        }

        if (workImage) {
          gsap.from(workImage, {
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 1,
            },
            x: index % 2 === 0 ? 100 : -100,
            opacity: 0,
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="works" className="relative py-32 px-6 lg:px-12 overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1745247468064-fedc01558d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJvbWUlMjBzcGhlcmUlMjAzRHxlbnwxfHx8fDE3NjcwOTkwMjh8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Chrome 3D sphere"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-white/90"></div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-32">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 lg:mb-8 text-muted-foreground">
            Our Projects
          </p>
          <h2 
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            Current &
            <br />
            <span className="italic">Future</span>
          </h2>
        </div>

        <div className="space-y-24 lg:space-y-40">
          {works.map((work, index) => (
            <div key={index} className="work-item group grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className={`work-content ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="mb-6 lg:mb-8">
                  <span className="text-6xl lg:text-8xl text-muted-foreground/20" style={{ fontFamily: 'var(--font-serif)' }}>
                    {work.number}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4 lg:mb-6">
                  <p className="text-xs tracking-[0.3em] uppercase text-accent">
                    {work.category}
                  </p>
                  <span className="text-xs px-3 py-1 bg-accent/10 text-accent rounded-full">
                    {work.status}
                  </span>
                </div>
                <h3 
                  style={{ fontFamily: 'var(--font-serif)' }}
                  className="text-[clamp(1.75rem,5vw,4rem)] mb-6 lg:mb-8 leading-[0.95] tracking-tight"
                >
                  {work.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm max-w-md">
                  {work.description}
                </p>
              </div>
              <div className={`work-image ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <ImageWithFallback
                  src={work.image}
                  alt={work.title}
                  className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}