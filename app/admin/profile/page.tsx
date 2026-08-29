'use client';
import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import { FiSave, FiCheck } from 'react-icons/fi';

const tabs = ['General', 'Bio (EN)', 'Bio (AR)', 'Social Links'];

export default function AdminProfile() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    name: '', title: '', titleAr: '',
    bio1: '', bio1Ar: '',
    bio2: '', bio2Ar: '',
    email: '', phone: '', github: '', facebook: '',
    telegram: '', linkedin: '', twitter: '', whatsapp: '',
    avatarUrl: '', resumeUrl: '',
    tagline: '', taglineAr: '', location: '', locationAr: '',
    availability: '', availabilityAr: '',
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

  const set = (k: keyof typeof form, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className=" text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; profile.edit</p>
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
              className="px-4 py-2 rounded-md text-sm  whitespace-nowrap transition-all"
              style={{ background: tab === i ? 'var(--accent)' : 'transparent', color: tab === i ? '#0a0a0f' : 'var(--text-muted)', fontWeight: tab === i ? 700 : 400 }}>
              {t}
            </button>
          ))}
        </div>

        <div className="tech-card p-8 space-y-6">
          {tab === 0 && (
            <div className="space-y-6">
              <div className="w-full max-w-xs">
                <ImageUpload value={form.avatarUrl} onChange={(url) => setForm((prev) => ({ ...prev, avatarUrl: url }))}
                  folder="profile" label="Profile Photo" aspect="square" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Job Title (EN)</label>
                  <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Email</label>
                  <input type="text" value={form.email} onChange={(e) => set('email', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Phone</label>
                  <input type="text" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Tagline (EN) — shown under hero title</label>
                  <input type="text" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>الشعار (AR)</label>
                  <input type="text" value={form.taglineAr} onChange={(e) => set('taglineAr', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Location (EN) e.g. Sudan</label>
                  <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>الموقع (AR)</label>
                  <input type="text" value={form.locationAr} onChange={(e) => set('locationAr', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Availability text (EN) e.g. Available for freelance</label>
                  <input type="text" value={form.availability} onChange={(e) => set('availability', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>حالة التوفر (AR)</label>
                  <input type="text" value={form.availabilityAr} onChange={(e) => set('availabilityAr', e.target.value)} className="tech-input" />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Resume / CV URL</label>
                  <input type="text" value={form.resumeUrl} onChange={(e) => set('resumeUrl', e.target.value)} className="tech-input" />
                </div>
              </div>
            </div>
          )}
          {tab === 1 && (
            <>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Job Title (English)</label>
                <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Bio Paragraph 1 (English)</label>
                <textarea value={form.bio1} onChange={(e) => set('bio1', e.target.value)} rows={5} className="tech-input resize-none" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Bio Paragraph 2 (English)</label>
                <textarea value={form.bio2} onChange={(e) => set('bio2', e.target.value)} rows={5} className="tech-input resize-none" />
              </div>
            </>
          )}
          {tab === 2 && (
            <>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>المسمى الوظيفي (عربي)</label>
                <input type="text" value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>الفقرة الأولى (عربي)</label>
                <textarea value={form.bio1Ar} onChange={(e) => set('bio1Ar', e.target.value)} rows={5} className="tech-input resize-none" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>الفقرة الثانية (عربي)</label>
                <textarea value={form.bio2Ar} onChange={(e) => set('bio2Ar', e.target.value)} rows={5} className="tech-input resize-none" />
              </div>
            </>
          )}
          {tab === 3 && (
            <>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>GitHub URL</label>
                <input type="text" value={form.github} onChange={(e) => set('github', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Facebook URL</label>
                <input type="text" value={form.facebook} onChange={(e) => set('facebook', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Telegram URL</label>
                <input type="text" value={form.telegram} onChange={(e) => set('telegram', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>WhatsApp URL (https://wa.me/...)</label>
                <input type="text" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>LinkedIn URL</label>
                <input type="text" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} className="tech-input" />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Twitter / X URL</label>
                <input type="text" value={form.twitter} onChange={(e) => set('twitter', e.target.value)} className="tech-input" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
