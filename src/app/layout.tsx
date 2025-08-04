// src/app/layout.tsx
'use client';

import './globals.css';
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/navbar'), {
  loading: () => <div className="h-16 animate-pulse" />,
});

const Footer = dynamic(() => import('@/components/footer'), {
  loading: () => <div className="h-20 animate-pulse" />,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1 animate-fadeIn">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
