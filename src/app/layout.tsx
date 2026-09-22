import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'VaakSuraksha - AI-Powered Voice Cloning Detection & Prevention',
  description: 'Real-time detection and prevention of voice cloning impersonation attacks. Built for Smart India Hackathon 2026 PS 26104.',
  keywords: ['voice cloning', 'deepfake detection', 'cybersecurity', 'AI security', 'SIH 2026', 'voice biometrics'],
  authors: [{ name: 'VaakSuraksha Team' }],
  openGraph: {
    title: 'VaakSuraksha - Voice Integrity Layer',
    description: 'AI-Powered Real-Time Detection & Prevention of Voice Cloning Impersonation Attacks',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}