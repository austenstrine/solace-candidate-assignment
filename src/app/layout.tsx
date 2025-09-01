import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './fonts/lato.css';

const mollieGlaston = localFont({
  src: './fonts/MollieGlaston.ttf',
  display: 'swap',
  variable: '--font-mollie-glaston',
  fallback: ['serif'],
});

export const metadata: Metadata = {
  title: 'Solace Candidate Assignment',
  description: 'Show us what you got',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={mollieGlaston.variable}>
      <body className='font-lato antialiased'>{children}</body>
    </html>
  );
}
