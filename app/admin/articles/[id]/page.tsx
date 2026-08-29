'use client';
import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import ArticleEditor from '@/components/admin/ArticleEditor';

export default function EditArticle() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${id}`).then(async (r) => {
      if (r.status === 401) { window.location.href = '/admin/login'; return; }
      if (!r.ok) { setMissing(true); return; }
      setArticle(await r.json());
    }).catch(() => setMissing(true));
  }, [id]);

  if (missing) return notFound();
  if (!article) return <p className="p-12 text-sm" style={{ color: 'var(--text-muted)' }}>Loading article…</p>;
  return <ArticleEditor article={article} />;
}
