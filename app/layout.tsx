import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'SparkFound | Student Startup Generator',
  description: 'Generate unique startup ideas based on your skills and interests.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#f5f5f5] text-[#1a1a1a] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
