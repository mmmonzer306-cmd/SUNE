import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

export interface SiteSettingsView {
  theme: 'dark' | 'light';
  lang: 'en' | 'ar';
  metaTitle: string;
  metaDesc: string;
}

const FALLBACK: SiteSettingsView = {
  theme: 'dark',
  lang: 'en',
  metaTitle: 'Alex Morgan | Software Engineer',
  metaDesc: 'Full-Stack Developer passionate about turning ideas into reality.',
};

/**
 * Cached site settings.
 *
 * The root layout needs these twice per request (generateMetadata + RootLayout).
 * Caching collapses that into a single query and survives across requests until
 * the settings API revalidates the layout.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsView> => {
    try {
      const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
      if (!row) return FALLBACK;
      return {
        theme: row.theme === 'light' ? 'light' : 'dark',
        lang: row.lang === 'ar' ? 'ar' : 'en',
        metaTitle: row.metaTitle || FALLBACK.metaTitle,
        metaDesc: row.metaDesc || FALLBACK.metaDesc,
      };
    } catch {
      return FALLBACK;
    }
  },
  ['site-settings'],
  { revalidate: 3600, tags: ['site-settings'] },
);
