import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import Link from 'next/link';
import { FiPlus, FiEdit, FiEye } from 'react-icons/fi';

export default async function AdminArticles() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {}

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; articles.manage</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Articles</h1>
          </div>
          <Link href="/admin/articles/new" className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus /> New Article
          </Link>
        </div>
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="tech-card p-12 text-center font-mono" style={{ color: 'var(--text-muted)' }}>// No articles yet.</div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="tech-card p-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold" style={{ color: 'var(--text)' }}>{article.title}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border" style={{
                      color: article.published ? '#4ade80' : 'var(--text-muted)',
                      borderColor: article.published ? 'rgba(74,222,128,0.2)' : 'var(--border)',
                      background: article.published ? 'rgba(74,222,128,0.1)' : 'transparent',
                    }}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs font-mono" style={{ color: 'var(--muted)' }}>
                    <span>/{article.slug}</span>
                    <span>{article.views} views</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${article.slug}`} target="_blank" className="p-2 transition-colors" style={{ color: 'var(--text-muted)' }}><FiEye size={16} /></Link>
                  <Link href={`/admin/articles/${article.id}`} className="p-2 transition-colors" style={{ color: 'var(--text-muted)' }}><FiEdit size={16} /></Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
