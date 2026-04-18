'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX, FiStar } from 'react-icons/fi';

interface Project { id: number; name: string; nameAr?: string; nameFr?: string; description?: string; descAr?: string; descFr?: string; techStack: string[]; githubUrl?: string; liveUrl?: string; imageUrl?: string; featured: boolean; }
const empty = { name: '', nameAr: '', nameFr: '', description: '', descAr: '', descFr: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '', featured: false };

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
    setForm({ ...empty, ...p, techStack: p.techStack.join(', ') } as typeof empty);
    setEditing(p.id); setShowForm(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; projects.manage</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Projects</h1>
          </div>
          <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus /> Add Project
          </button>
        </div>

        {showForm && (
          <div className="tech-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-sm" style={{ color: 'var(--accent)' }}>{editing ? '// Edit Project' : '// New Project'}</p>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><FiX /></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(['name', 'nameAr', 'nameFr'] as const).map((k, i) => (
                    <div key={k}>
                      <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
                        {['Name (EN)', 'الاسم (AR)', 'Nom (FR)'][i]}
                      </label>
                      <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="tech-input text-sm py-2" />
                    </div>
                  ))}
                </div>
                {[
                  { k: 'description', label: 'Description (EN)' },
                  { k: 'descAr', label: 'الوصف (AR)' },
                  { k: 'descFr', label: 'Description (FR)' },
                ].map(({ k, label }) => (
                  <div key={k}>
                    <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                    <textarea value={form[k as keyof typeof form] as string} onChange={(e) => setForm({ ...form, [k]: e.target.value })} rows={2} className="tech-input text-sm resize-none" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Tech Stack (comma separated)</label>
                  <input value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="tech-input text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>Live URL</label>
                    <input value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="tech-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>GitHub URL</label>
                    <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="tech-input text-sm" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ accentColor: 'var(--accent)' }} />
                  <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Mark as Featured</span>
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
              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-16 h-12 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold" style={{ color: 'var(--text)' }}>{p.name}</h3>
                  {p.nameAr && <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>/ {p.nameAr}</span>}
                  {p.featured && <FiStar size={14} style={{ color: '#f59e0b' }} />}
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.techStack.map((t) => (
                    <span key={t} className="text-xs font-mono" style={{ color: 'var(--accent-2)' }}>{t}</span>
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
