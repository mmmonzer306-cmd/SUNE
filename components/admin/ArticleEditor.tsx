'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
import ImageUpload from '@/components/ui/ImageUpload';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface Props {
  article?: { id: number; title: string; excerpt: string | null; content: string; tags: string[]; published: boolean; coverImage: string | null; };
}

export default function ArticleEditor({ article }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    tags: article?.tags.join(', ') || '',
    published: article?.published || false,
    coverImage: article?.coverImage || '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    const url = article ? `/api/articles/${article.id}` : '/api/articles';
    const method = article ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) router.push('/admin/articles');
    setSaving(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin/articles" className="flex items-center gap-2 text-sm font-mono transition-colors" style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <FiArrowLeft size={14} /> Back
          </Link>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-mono cursor-pointer" style={{ color: 'var(--text-muted)' }}>
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-[#00d4ff]" />
              Publish
            </label>
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 text-sm py-2">
              <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <input type="text" placeholder="Article Title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="tech-input text-2xl font-bold" style={{ border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, paddingLeft: 0, paddingRight: 0 }} />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="tech-input text-sm" />
            <ImageUpload value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} label="Cover Image" />
          </div>
          <textarea placeholder="Brief excerpt..." value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="tech-input resize-none text-sm" />
          <div data-color-mode="dark">
            <MDEditor value={form.content} onChange={(v) => setForm({ ...form, content: v || '' })} height={500}
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }} />
          </div>
        </div>
      </main>
    </div>
  );
}
