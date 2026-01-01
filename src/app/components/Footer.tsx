export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 px-6 lg:px-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
          <div>
            <h3 
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-[clamp(1.75rem,3vw,2.5rem)] mb-3 leading-tight"
            >
              Pet Collabo
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              AI-Driven Innovation Across Industries
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-10 gap-y-4">
            <a href="#philosophy" className="text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors">
              Philosophy
            </a>
            <a href="#works" className="text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors">
              Works
            </a>
            <a href="#members" className="text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors">
              Members
            </a>
            <a href="#contact" className="text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors">
              Contact
            </a>
          </nav>
        </div>

        <div className="pt-10 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground tracking-wider">
            © {currentYear} Pet Collabo. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-muted-foreground hover:text-accent transition-colors tracking-wider">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-accent transition-colors tracking-wider">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}