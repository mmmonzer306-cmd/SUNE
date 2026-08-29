import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { getSiteSettings } from '@/lib/settings';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.metaTitle;
  const description = settings.metaDesc;
  return {
    metadataBase: new URL(SITE_URL),
    icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/icon.svg' },
    title,
    description,
    keywords: ['Alex Morgan', 'Software Engineer', 'Full-Stack', 'React', 'Next.js', 'Portfolio', 'مطور ويب'],
    authors: [{ name: 'Alex Morgan', url: SITE_URL }],
    creator: 'Alex Morgan',
    alternates: {
      canonical: '/',
      languages: { en: '/', ar: '/' },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: SITE_URL,
      siteName: 'Alex Morgan',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
     name: 'Alex Morgan',
    url: SITE_URL,
    jobTitle: 'Full-Stack Web Developer',
    sameAs: [
      'https://github.com/example',
      'https://example.com/social',
      'https://example.com/messaging',
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme, lang } = await getSiteSettings();
  const isRtl = lang === 'ar';

  return (
    <html lang={lang} dir={isRtl ? 'rtl' : 'ltr'} data-theme={theme}
      className={`scroll-smooth${theme === 'dark' ? ' dark' : ''}`}
      suppressHydrationWarning>
      <head>
        {/* Runs before CSSOM paint — prevents any theme/direction flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'${theme}';var l=localStorage.getItem('lang')||'${lang}';var d=document.documentElement;d.setAttribute('data-theme',t);d.classList.toggle('dark',t==='dark');d.dir=l==='ar'?'rtl':'ltr';d.lang=l;if(sessionStorage.getItem('splash-shown')==='2')d.setAttribute('data-splash-skip','1');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <JsonLd />
        <Providers theme={theme} lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
