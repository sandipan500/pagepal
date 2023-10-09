import { cn } from '@/lib/utils';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
      <body className={cn('min-h-screen font-sans antialiased grainy', font.className)}>
        {children}
      </body>
    </html>
  )
};