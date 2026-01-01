import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 transition-all duration-500 ${
        isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Outer rotating border */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent/80 to-accent/60 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-secondary border-2 border-accent rounded-full flex items-center justify-center hover:bg-accent transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg">
          <ArrowUp className="w-5 h-5 lg:w-6 lg:h-6 text-accent group-hover:text-secondary transition-colors" />
        </div>
        
        {/* Decorative corner marks */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </button>
  );
}
