import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { FiArrowLeft, FiEye, FiCalendar, FiClock } from 'react-icons/fi';
import type { Metadata } from 'next';
import { ReadingProgress, ShareButtons, ArticleBody } from '@/components/blog/ArticleEnhancements';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({ where: { slug } });
    if (!article) return { title: 'Not Found' };
    return { title: `${article.title} | Alex Morgan`, description: article.excerpt || '' };
  } catch {
    return { title: 'Alex Morgan' };
  }
}

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let article: any = null;
  let profile: any = null;
  try {
    [article, profile] = await Promise.all([
      prisma.article.findUnique({ where: { slug } }),
      prisma.profile.findUnique({ where: { id: 1 } }),
    ]);
    if (article) article.tags = parseArray(article.tags);
  } catch {}

  if (!article || !article.published) notFound();

  try {
    await prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });
  } catch {}

  const readMinutes = Math.max(1, Math.ceil(String(article.content).split(/\s+/).length / 200));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || '',
    datePublished: article.createdAt,
    author: { '@type': 'Person', name: 'Alex Morgan' },
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm  mb-12 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <FiArrowLeft /> Back to Blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag: string) => (
              <span key={tag} className="text-xs  px-2 py-1 rounded"
                style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.2)' }}>
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: 'var(--text)' }}>{article.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs mb-12 pb-8" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex gap-6">
              <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><FiEye size={11} /> {article.views + 1} views</span>
              <span className="flex items-center gap-1"><FiClock size={11} /> {readMinutes} min read</span>
            </div>
            <ShareButtons title={article.title} />
          </div>
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:text-[var(--text)]
            prose-p:text-[var(--text-muted)] prose-p:leading-relaxed
            prose-a:text-[var(--accent)] prose-code:text-[var(--accent)]
            prose-strong:text-[var(--text)]">
            <ArticleBody>
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </ArticleBody>
          </div>
        </div>
      </main>
      <Footer profile={profile || {}} />
    </>
  );
}
