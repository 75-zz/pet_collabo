import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

gsap.registerPlugin(ScrollTrigger);

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

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

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      // Vercel Serverless Function経由でメール送信
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });

        // 5秒後にステータスをリセット
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        throw new Error(result.error || 'フォーム送信に失敗しました');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '送信中にエラーが発生しました。もう一度お試しください。'
      );

      // 5秒後にエラーをクリア
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
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

          {/* Status Message */}
          {submitStatus === 'success' && (
            <div className="form-field p-6 bg-green-50 border-2 border-green-500 text-green-800 text-center">
              <p className="text-sm font-medium">✓ お問い合わせを受け付けました</p>
              <p className="text-xs mt-2">3営業日以内にご連絡いたします。</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="form-field p-6 bg-red-50 border-2 border-red-500 text-red-800 text-center">
              <p className="text-sm font-medium">✗ エラーが発生しました</p>
              <p className="text-xs mt-2">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-field">
            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className={`w-full py-6 transition-all duration-300 text-xs tracking-[0.2em] uppercase relative overflow-hidden ${
                submitStatus === 'submitting'
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {submitStatus === 'submitting' ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
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