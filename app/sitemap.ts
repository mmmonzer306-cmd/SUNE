import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
  try {
    const articles = await prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
    const projects = await prisma.project.findMany({ where: { slug: { not: null } }, select: { slug: true, createdAt: true } });
    base.push(
      ...articles.map((a) => ({ url: `${SITE_URL}/blog/${a.slug}`, lastModified: a.updatedAt , changeFrequency: 'monthly' as const, priority: 0.6 })),
      ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: p.createdAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    );
  } catch {}
  return base;
}
