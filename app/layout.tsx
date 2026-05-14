import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Spot the Difference Generator',
  description: 'Generate unlimited children-friendly Spot the Difference puzzles powered by AI',
  keywords: [
    'spot the difference',
    'puzzle game',
    'children',
    'education',
    'AI generated',
    'interactive',
  ],
  authors: [{ name: 'Spot the Difference Generator' }],
  openGraph: {
    title: 'AI Spot the Difference Generator',
    description: 'Create unlimited children-friendly puzzle games with AI',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#eb8c42" />
      </head>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          {children}
        </div>
      </body>
    </html>
  );
}
