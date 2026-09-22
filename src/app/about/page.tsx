import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import { AboutPageClient } from './AboutPageClient';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AboutPageClient />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}