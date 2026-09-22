import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import { AccuracyPageClient } from './AccuracyPageClient';

export const dynamic = 'force-dynamic';

export default function AccuracyPage() {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AccuracyPageClient />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}