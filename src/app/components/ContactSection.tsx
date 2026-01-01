import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

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

      const formFields = formRef.current?.querySelectorAll('.form-field');
      if (formFields && formFields.length > 0) {
        gsap.from(formFields, {
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
          },
          y: 60,
          opacity: 0,
          stagger: 0.1,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('お問い合わせを受け付けました。3営業日以内にご連絡いたします。');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 px-6 lg:px-12 overflow-hidden bg-secondary">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1667295608978-fd6ec8b16579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRhbGxpYyUyMHN1cmZhY2UlMjB0ZXh0dXJlfGVufDF8fHx8MTc2NzA5OTAyOHww&ixlib=rb-4.1.0&q=80&w=1920"
          alt="Metallic surface texture"
          className="w-full h-full object-cover opacity-15"
        />
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-secondary/90"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto">
        <div ref={titleRef} className="mb-20 lg:mb-32 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 lg:mb-8 text-muted-foreground">
            Recruit Information
          </p>
          <h2 
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            Get in
            <br />
            <span className="italic">Touch</span>
          </h2>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
          <div className="form-field">
            <label htmlFor="name" className="block text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white border-black/10 focus:border-accent py-6"
            />
          </div>

          <div className="form-field">
            <label htmlFor="email" className="block text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white border-black/10 focus:border-accent py-6"
            />
          </div>

          <div className="form-field">
            <label htmlFor="company" className="block text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
              Company
            </label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-white border-black/10 focus:border-accent py-6"
            />
          </div>

          <div className="form-field">
            <label htmlFor="message" className="block text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
              Message *
            </label>
            <Textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full bg-white border-black/10 focus:border-accent resize-none"
            />
          </div>

          <button
            type="submit"
            className="form-field w-full py-6 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 text-xs tracking-[0.2em] uppercase"
          >
            Send Message
          </button>
        </form>

        <div className="mt-16 lg:mt-24 pt-12 lg:pt-16 border-t border-black/10 grid sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 text-center">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-3 text-muted-foreground">Email</p>
            <p className="text-sm break-all">contact@petcollabo.com</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase mb-3 text-muted-foreground">Location</p>
            <p className="text-sm">Tokyo, Japan</p>
          </div>
          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-xs tracking-[0.2em] uppercase mb-3 text-muted-foreground">Follow</p>
            <div className="flex gap-6 justify-center">
              <a href="#" className="text-sm hover:text-accent transition-colors">Twitter</a>
              <a href="#" className="text-sm hover:text-accent transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}