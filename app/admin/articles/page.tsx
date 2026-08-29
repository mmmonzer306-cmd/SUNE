'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiEye } from 'react-icons/fi';
import DeleteArticleButton from './DeleteArticleButton';

interface Article {
  id: number; title: string; slug: string; published: boolean;
  views: number; createdAt: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles?all=1').then(async (r) => {
      if (r.status === 401) { window.location.href = '/admin/login'; return; }
      const d = await r.json();
      if (Array.isArray(d)) setArticles(d);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; articles.manage</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Articles</h1>
          </div>
          <Link href="/admin/articles/new" className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus /> New Article
          </Link>
        </div>
        <div className="space-y-4">
          {articles.length === 0 ? (
            <div className="tech-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>{'// No articles yet.'}</div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="tech-card p-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold" style={{ color: 'var(--text)' }}>{article.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded border" style={{
                      color: article.published ? '#4ade80' : 'var(--text-muted)',
                      borderColor: article.published ? 'rgba(74,222,128,0.2)' : 'var(--border)',
                      background: article.published ? 'rgba(74,222,128,0.1)' : 'transparent',
                    }}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs" style={{ color: 'var(--muted)' }}>
                    <span>/{article.slug}</span>
                    <span>{article.views} views</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/blog/${article.slug}`} target="_blank" className="p-2 transition-colors" style={{ color: 'var(--text-muted)' }}><FiEye size={16} /></Link>
                  <Link href={`/admin/articles/${article.id}`} className="p-2 transition-colors" style={{ color: 'var(--text-muted)' }}><FiEdit size={16} /></Link>
                  <DeleteArticleButton id={article.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
