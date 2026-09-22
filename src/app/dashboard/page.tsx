import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import { DashboardPageClient } from './DashboardPageClient';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <DashboardPageClient />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}