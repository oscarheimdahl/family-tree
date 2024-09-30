import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './styles/globals.css';
import './styles/other.css';

import { Provider } from 'jotai';

import { Toaster } from '@/components/ui/sonner';

import { Providers } from './Providers';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Pettersson Family Tree',
  description: 'Overview of the pettersson family tree',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          <Providers>{children}</Providers>
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
