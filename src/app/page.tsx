import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { LanguageProvider } from '@/components/LanguageProvider';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}