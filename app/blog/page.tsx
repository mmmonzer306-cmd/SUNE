import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { FiArrowLeft, FiEye, FiCalendar } from 'react-icons/fi';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Alex Morgan',
  description: 'Technical articles and insights from Alex Morgan',
};

export const revalidate = 3600;

function parseArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export default async function BlogPage() {
  let articles: any[] = [];
  let profile: any = null;
  try {
    [articles, profile] = await Promise.all([
      prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, slug: true, excerpt: true, tags: true, createdAt: true, views: true },
      }),
      prisma.profile.findUnique({ where: { id: 1 } }),
    ]);
    articles = (articles as any[]).map((a) => ({ ...a, tags: parseArray(a.tags) }));
  } catch {}

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm  mb-12 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <FiArrowLeft /> Back to Portfolio
          </Link>
          <div className="mb-16">
            <p className=" text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>&gt; blog.all</p>
            <h1 className="section-title mb-4">Tech Articles</h1>
            <div className="section-ornament !mx-0" />
          </div>

          {articles.length === 0 ? (
            <div className="text-center  py-20 tech-card" style={{ color: 'var(--text-muted)' }}>
              {'// No articles published yet.'}
            </div>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="tech-card block p-8 glow-box-hover">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag: string) => (
                      <span key={tag} className="text-xs  px-2 py-1 rounded"
                        style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.2)' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>{article.title}</h2>
                  {article.excerpt && <p className="leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{article.excerpt}</p>}
                  <div className="flex gap-6 text-xs " style={{ color: 'var(--muted)' }}>
                    <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><FiEye size={11} /> {article.views} views</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile || {}} />
    </>
  );
}
