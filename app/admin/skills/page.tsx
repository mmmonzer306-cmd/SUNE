'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiPlus, FiTrash2, FiEdit, FiSave, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface Skill { id: number; name: string; nameAr?: string; description?: string; descAr?: string; level: number; imageUrl?: string; category?: string; }
const empty = { name: '', nameAr: '', description: '', descAr: '', level: 80, imageUrl: '', category: 'frontend' };

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch('/api/skills').then((r) => r.json()).then(setSkills);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing) {
      await fetch('/api/skills', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...form }) });
    } else {
      await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    await fetch('/api/skills', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const edit = (s: Skill) => { setForm({ ...empty, ...s }); setEditing(s.id); setShowForm(true); };
  const set = (k: keyof typeof empty, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className=" text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; skills.manage</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Skills</h1>
          </div>
          <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="btn-primary flex items-center gap-2 text-sm">
            <FiPlus /> Add Skill
          </button>
        </div>

        {showForm && (
          <div className="tech-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <p className=" text-sm" style={{ color: 'var(--accent)' }}>{editing ? '// Edit Skill' : '// New Skill'}</p>
              <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}><FiX /></button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Name (EN)</label>
                    <input value={String(form.name)} onChange={(e) => set('name', e.target.value)} className="tech-input text-sm py-2" />
                  </div>
                  <div>
                    <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>الاسم (AR)</label>
                    <input value={String(form.nameAr)} onChange={(e) => set('nameAr', e.target.value)} className="tech-input text-sm py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Category</label>
                  <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="tech-input text-sm">
                    {['frontend', 'backend', 'tools', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Level: {form.level}%</label>
                  <input type="range" min={0} max={100} value={form.level}
                    onChange={(e) => setForm((prev) => ({ ...prev, level: Number(e.target.value) }))}
                    className="w-full" style={{ accentColor: 'var(--accent)' }} />
                </div>
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>Description (EN)</label>
                  <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={2} className="tech-input text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-xs  mb-1" style={{ color: 'var(--text-muted)' }}>الوصف (AR)</label>
                  <textarea value={form.descAr} onChange={(e) => setForm((prev) => ({ ...prev, descAr: e.target.value }))} rows={2} className="tech-input text-sm resize-none" />
                </div>
              </div>
              <ImageUpload value={form.imageUrl} onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))} folder="skills" label="Skill Image (optional)" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="btn-primary flex items-center gap-2 text-sm"><FiSave /> Save</button>
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((s) => (
            <div key={s.id} className="tech-card p-5 flex items-center gap-4">
              {s.imageUrl && <Image src={s.imageUrl} alt={s.name} width={48} height={48} className="w-12 h-12 rounded-lg object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold" style={{ color: 'var(--text)' }}>{s.name}</span>
                  {s.nameAr && <span className="text-xs " style={{ color: 'var(--text-muted)' }}>/ {s.nameAr}</span>}
                </div>
                <div className="skill-bar mt-2">
                  <div className="skill-bar-fill" style={{ width: `${s.level}%` }} />
                </div>
                <span className="text-xs  mt-1" style={{ color: 'var(--accent)' }}>{s.level}%</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => edit(s)} className="p-2 rounded transition-colors" style={{ color: 'var(--text-muted)' }}><FiEdit size={15} /></button>
                <button onClick={() => del(s.id)} className="p-2 rounded transition-colors hover:text-red-400" style={{ color: 'var(--text-muted)' }}><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
