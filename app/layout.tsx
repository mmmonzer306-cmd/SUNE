import type { Metadata } from 'next';
import { Space_Grotesk, Fira_Code, Orbitron } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { prisma } from '@/lib/prisma';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return {
      title: settings?.metaTitle || 'Mohammed Mohsen | Software Engineer',
      description: settings?.metaDesc || 'Full-Stack Developer',
      keywords: ['Mohammed Mohsen', 'Software Engineer', 'Full-Stack', 'React', 'Next.js'],
      openGraph: { title: settings?.metaTitle || 'Mohammed Mohsen', type: 'website' },
    };
  } catch {
    return { title: 'Mohammed Mohsen | Software Engineer' };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let theme = 'dark';
  let lang = 'en';
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    theme = settings?.theme || 'dark';
    lang = settings?.lang || 'en';
  } catch {}

  const isRtl = lang === 'ar';

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'}
      className={`scroll-smooth ${spaceGrotesk.variable} ${firaCode.variable} ${orbitron.variable}`}
      suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers theme={theme} lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
