import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'react-loading-skeleton/dist/skeleton.css';

import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PagePal',
  description: 'Bringing PDFs into the conversation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <Providers>
        <body className={cn('min-h-screen font-sans antialiased grainy', font.className)}>
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  )
};