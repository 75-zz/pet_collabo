import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PhilosophySection } from './components/PhilosophySection';
import { WorksSection } from './components/WorksSection';
import { MembersSection } from './components/MembersSection';
import { CultureSection } from './components/CultureSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      <Header />
      <main>
        <HeroSection />
        <PhilosophySection />
        <WorksSection />
        <MembersSection />
        <CultureSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}