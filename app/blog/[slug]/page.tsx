import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { FiArrowLeft, FiEye, FiCalendar } from 'react-icons/fi';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const article = await prisma.article.findUnique({ where: { slug: params.slug } });
    if (!article) return { title: 'Not Found' };
    return { title: `${article.title} | Mohammed Mohsen`, description: article.excerpt || '' };
  } catch {
    return { title: 'Mohammed Mohsen' };
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article: any = null;
  let profile: any = null;
  try {
    [article, profile] = await Promise.all([
      prisma.article.findUnique({ where: { slug: params.slug } }),
      prisma.profile.findUnique({ where: { id: 1 } }),
    ]);
  } catch {}

  if (!article || !article.published) notFound();

  try {
    await prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } });
  } catch {}

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-mono mb-12 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <FiArrowLeft /> Back to Blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-mono px-2 py-1 rounded"
                style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.2)' }}>
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: 'var(--text)' }}>{article.title}</h1>
          <div className="flex gap-6 text-xs font-mono mb-12 pb-8" style={{ color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
            <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(article.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><FiEye size={11} /> {article.views + 1} views</span>
          </div>
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:text-[var(--text)]
            prose-p:text-[var(--text-muted)] prose-p:leading-relaxed
            prose-a:text-[var(--accent)] prose-code:text-[var(--accent)]
            prose-strong:text-[var(--text)]">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer profile={profile || {}} />
    </>
  );
}
