'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiEye, FiCalendar } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

interface Article { id: number; title: string; slug: string; excerpt?: string; tags: string[]; coverImage?: string; createdAt: Date; views: number; }

export default function BlogPreview({ articles }: { articles: Article[] }) {
  const { t } = useApp();
  if (articles.length === 0) return null;

  return (
    <section id="blog" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-end justify-between mb-16">
          <div>
            <p className="font-mono text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>&gt; blog.latest</p>
            <h2 className="section-title gradient-text">{t('blog.title')}</h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-sm font-mono transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            View All <FiArrowRight />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <motion.div key={article.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/blog/${article.slug}`} className="tech-card glow-hover block p-6 h-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2 py-1 rounded tag-accent">#{tag}</span>
                  ))}
                </div>
                <h3 className="font-bold mb-3 line-clamp-2" style={{ color: 'var(--text)' }}>{article.title}</h3>
                {article.excerpt && <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-muted)' }}>{article.excerpt}</p>}
                <div className="flex items-center gap-4 text-xs font-mono" style={{ color: 'var(--muted)' }}>
                  <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(article.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><FiEye size={11} /> {article.views}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
