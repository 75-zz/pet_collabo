import { useState, useEffect } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white/70 backdrop-blur-sm'
      } border-b border-black/10`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-xl lg:text-2xl tracking-wide hover:text-accent transition-colors relative z-[201]"
            >
              Pet Collabo
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-10">
              <button 
                onClick={() => scrollToSection('philosophy')} 
                className="text-xs lg:text-sm tracking-wider uppercase hover:text-accent transition-colors"
              >
                Philosophy
              </button>
              <button 
                onClick={() => scrollToSection('works')} 
                className="text-xs lg:text-sm tracking-wider uppercase hover:text-accent transition-colors"
              >
                Works
              </button>
              <button 
                onClick={() => scrollToSection('members')} 
                className="text-xs lg:text-sm tracking-wider uppercase hover:text-accent transition-colors"
              >
                Members
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="text-xs lg:text-sm tracking-wider uppercase hover:text-accent transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Stylish Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-12 h-12 flex items-center justify-center group z-[201]"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-4">
                {/* Top line */}
                <span className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? 'top-1/2 -translate-y-1/2 rotate-45'
                    : 'top-0 rotate-0'
                }`}></span>

                {/* Middle line */}
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}></span>

                {/* Bottom line */}
                <span className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMenuOpen
                    ? 'top-1/2 -translate-y-1/2 -rotate-45'
                    : 'bottom-0 rotate-0'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Full Screen Overlay (Outside of header) */}
      <div className={`md:hidden fixed inset-0 bg-white/96 backdrop-blur-lg transition-all duration-500 z-[150] ${
        isMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        <div className="h-full w-full flex items-center justify-center px-6">
          <nav className="w-full max-w-md">
            <div className="flex flex-col gap-10 text-center">
              {[
                { id: 'philosophy', label: 'Philosophy', number: '01' },
                { id: 'works', label: 'Works', number: '02' },
                { id: 'members', label: 'Members', number: '03' },
                { id: 'contact', label: 'Contact', number: '04' }
              ].map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative transition-all duration-300 ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: isMenuOpen ? `${index * 100 + 100}ms` : '0ms'
                  }}
                >
                  <div className="flex items-baseline gap-4 justify-center">
                    <span 
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="text-4xl sm:text-5xl text-muted-foreground/20 group-hover:text-accent/40 transition-colors"
                    >
                      {item.number}
                    </span>
                    <span 
                      style={{ fontFamily: 'var(--font-serif)' }}
                      className="text-3xl sm:text-4xl tracking-wide group-hover:text-accent transition-colors italic"
                    >
                      {item.label}
                    </span>
                  </div>
                  <div className="h-px bg-accent/0 group-hover:bg-accent/40 transition-all duration-300 mt-2 scale-x-0 group-hover:scale-x-100"></div>
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
