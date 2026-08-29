'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX, FiStar } from 'react-icons/fi';
import Image from 'next/image';

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string') { try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}
interface Project { id: number; name: string; nameAr?: string; description?: string; descAr?: string; techStack: string[] | string; githubUrl?: string; liveUrl?: string; imageUrl?: string; featured: boolean; slug?: string; caseStudy?: string; }
const empty = { name: '', nameAr: '', description: '', descAr: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '', featured: false, slug: '', caseStudy: '' };

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch('/api/projects').then((r) => r.json()).then(setProjects);
  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = { ...form, techStack: (form.techStack as string).split(',').map((t) => t.trim()).filter(Boolean) };
    if (editing) {
      await fetch(`/api/projects/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } else {
      await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' }); load();
  };

  const edit = (p: Project) => {
    setForm({ ...empty, ...p, techStack: asArray(p.techStack).join(', ') } as typeof empty);
    setEditing(p.id); setShowForm(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className=" text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; projects.manage</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Projects</h1>
          </div>
          <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus /> Add Project
          </button>
        </div>

        {showForm && (
          <div className="tech-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <p className=" text-sm" style={{ color: 'var(--accent)' }}>{editing ? '// Edit Project' : '// New Project'}</p>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><FiX /></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(['name', 'nameAr'] as const).map((k, i) => (
                    <div key={k}>
                      <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>
                        {['Name (EN)', 'الاسم (AR)'][i]}
                      </label>
                      <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="tech-input text-sm py-2" />
                    </div>
                  ))}
                </div>
                {[
                  { k: 'description', label: 'Description (EN)' },
                  { k: 'descAr', label: 'الوصف (AR)' },
                ].map(({ k, label }) => (
                  <div key={k}>
                    <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                    <textarea value={form[k as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [k]: e.target.value })} rows={2} className="tech-input text-sm resize-none" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Slug (URL) — auto if empty</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="tech-input text-sm" placeholder="my-project" />
                </div>
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Case Study (Markdown)</label>
                  <textarea value={form.caseStudy} onChange={(e) => setForm({ ...form, caseStudy: e.target.value })} rows={6}
                    className="tech-input text-sm resize-none" placeholder="## Overview&#10;## The Challenge&#10;## The Solution&#10;## The Result" />
                </div>
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Tech Stack (comma separated)</label>
                  <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="tech-input text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Live URL</label>
                    <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="tech-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>GitHub URL</label>
                    <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="tech-input text-sm" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: 'var(--accent)' }} />
                  <span className="text-sm " style={{ color: 'var(--text-muted)' }}>Mark as Featured</span>
                </label>
              </div>
              <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} folder="projects" label="Project Screenshot" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="btn-primary flex items-center gap-2 text-sm"><FiSave /> Save</button>
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="tech-card p-5 flex items-center gap-4">
              {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={64} height={48} className="w-16 h-12 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold" style={{ color: 'var(--text)' }}>{p.name}</h3>
                  {p.nameAr && <span className="text-xs " style={{ color: 'var(--text-muted)' }}>/ {p.nameAr}</span>}
                  {p.featured && <FiStar size={14} style={{ color: '#f59e0b' }} />}
                </div>
                <div className="flex flex-wrap gap-1">
                  {asArray(p.techStack).map((t) => (
                    <span key={t} className="text-xs " style={{ color: 'var(--accent-2)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(p)} className="p-2 rounded transition-colors" style={{ color: 'var(--text-muted)' }}><FiEdit size={15} /></button>
                <button onClick={() => del(p.id)} className="p-2 rounded hover:text-red-400 transition-colors" style={{ color: 'var(--text-muted)' }}><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
