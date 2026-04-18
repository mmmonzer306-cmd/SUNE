'use client';
import { useEffect, useState } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiSave, FiCheck } from 'react-icons/fi';

const tabs = ['General', 'Bio (EN)', 'Bio (AR)', 'Bio (FR)', 'Social Links'];

export default function AdminProfile() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    name: '', title: '', titleAr: '', titleFr: '',
    bio1: '', bio1Ar: '', bio1Fr: '',
    bio2: '', bio2Ar: '', bio2Fr: '',
    email: '', phone: '', github: '', facebook: '',
    telegram: '', linkedin: '', twitter: '',
    avatarUrl: '', resumeUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then((d) => { if (d) setForm((f) => ({ ...f, ...d })); });
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const F = ({ k, label, multi = false, rows = 4 }: { k: keyof typeof form; label: string; multi?: boolean; rows?: number }) => (
    <div>
      <label className="block text-sm font-mono mb-2" style={{ color: 'var(--text-muted)' }}>{label}</label>
      {multi ? (
        <textarea value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          rows={rows} className="tech-input resize-none" />
      ) : (
        <input type="text" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="tech-input" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-mono text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; profile.edit</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Edit Profile</h1>
          </div>
          <button onClick={save} disabled={saving}
            className="btn-primary flex items-center gap-2 text-sm">
            {saved ? <><FiCheck /> Saved!</> : saving ? 'Saving...' : <><FiSave /> Save</>}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg mb-8 overflow-x-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="px-4 py-2 rounded-md text-sm font-mono whitespace-nowrap transition-all"
              style={{ background: tab === i ? 'var(--accent)' : 'transparent', color: tab === i ? '#0a0a0f' : 'var(--text-muted)', fontWeight: tab === i ? 700 : 400 }}>
              {t}
            </button>
          ))}
        </div>

        <div className="tech-card p-8 space-y-6">
          {tab === 0 && (
            <>
              {/* Avatar upload */}
              <div className="flex gap-8 items-start">
                <div className="shrink-0">
                  <ImageUpload value={form.avatarUrl} onChange={(url) => setForm({ ...form, avatarUrl: url })}
                    folder="profile" label="Profile Photo" aspect="square" />
                </div>
                <div className="flex-1 space-y-4">
                  <F k="name" label="Full Name" />
                  <F k="title" label="Job Title (EN)" />
                  <F k="email" label="Email" />
                  <F k="phone" label="Phone" />
                </div>
              </div>
              <F k="resumeUrl" label="Resume / CV URL" />
            </>
          )}
          {tab === 1 && (
            <>
              <F k="title" label="Job Title (English)" />
              <F k="bio1" label="Bio Paragraph 1 (English)" multi rows={5} />
              <F k="bio2" label="Bio Paragraph 2 (English)" multi rows={5} />
            </>
          )}
          {tab === 2 && (
            <>
              <F k="titleAr" label="المسمى الوظيفي (عربي)" />
              <F k="bio1Ar" label="الفقرة الأولى (عربي)" multi rows={5} />
              <F k="bio2Ar" label="الفقرة الثانية (عربي)" multi rows={5} />
            </>
          )}
          {tab === 3 && (
            <>
              <F k="titleFr" label="Titre du poste (Français)" />
              <F k="bio1Fr" label="Paragraphe 1 (Français)" multi rows={5} />
              <F k="bio2Fr" label="Paragraphe 2 (Français)" multi rows={5} />
            </>
          )}
          {tab === 4 && (
            <>
              <F k="github" label="GitHub URL" />
              <F k="facebook" label="Facebook URL" />
              <F k="telegram" label="Telegram URL" />
              <F k="linkedin" label="LinkedIn URL" />
              <F k="twitter" label="Twitter / X URL" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
