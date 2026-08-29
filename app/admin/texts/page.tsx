'use client';
import { useEffect, useState } from 'react';
import { FiSave, FiTrash2, FiPlus, FiEdit } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';

interface Snippet { key: string; value: string; valueAr: string | null; }

const LABELS: Record<string, string> = {
  'brand.mark': 'Brand mark', 'brand.suffix': 'Brand suffix',
  'nav.home': 'Home navigation label', 'nav.about': 'About navigation label',
  'nav.skills': 'Skills navigation label', 'nav.services': 'Services navigation label',
  'nav.projects': 'Projects navigation label', 'nav.blog': 'Blog navigation label',
  'nav.contact': 'Contact navigation label', 'nav.available': 'Availability badge',
  'nav.cta': 'Navigation call to action',
  'nav.stats': 'Stats navigation label', 'nav.experience': 'Experience navigation label',
  'nav.testimonials': 'Testimonials navigation label', 'nav.faq': 'FAQ navigation label',
  'footer.description': 'Footer description', 'footer.cta': 'Footer call to action',
  'footer.crafted': 'Footer crafted label', 'footer.passion': 'Footer passion label',
  'marquee.hint': 'Technology strip hint',
  'blocks.title': 'Why-me section title', 'blocks.hint': 'Why-me section hint',
  'experience.hint': 'Experience section hint', 'experience.storyLabel': 'Experience story label',
  'experience.readMore': 'Experience read-more label', 'projects.story': 'Project story label',
  'projects.all': 'All projects filter', 'projects.featured': 'Featured projects filter',
  'projects.emptyTitle': 'Empty projects title', 'projects.emptyText': 'Empty projects description',
  'contact.intro': 'Contact intro text', 'contact.budget': 'Budget label',
  'contact.back': 'Contact back button', 'contact.next': 'Contact next button',
  'splash.cornerTop': 'Splash top corner', 'splash.cornerBottom': 'Splash bottom corner',
  'splash.brandEyebrow': 'Splash brand eyebrow', 'splash.firstName': 'Splash first name',
  'splash.lastName': 'Splash last name', 'splash.role': 'Splash role',
  'splash.roleSuffix': 'Splash role suffix', 'splash.loading': 'Splash loading label',
  'splash.status': 'Splash availability label', 'splash.introEyebrow': 'Splash intro eyebrow',
  'splash.headlineLine1': 'Splash headline line one', 'splash.headlineLine2': 'Splash headline line two',
  'splash.headlineAccent': 'Splash headline accent', 'splash.description': 'Splash description',
  'splash.enter': 'Splash enter button', 'splash.skip': 'Splash skip button',
  'splash.scroll': 'Splash scroll hint', 'splash.languages': 'Splash language label',
  'splash.sideLeft': 'Splash left note', 'splash.sideLeftSecond': 'Splash left note second line',
  'splash.sideRight': 'Splash right note', 'splash.sideRightSecond': 'Splash right note second line',
  'kicker.home': 'Hero greeting chip',
  'kicker.about': 'About section tag',
  'kicker.skills': 'Skills tag', 'kicker.services': 'Services tag',
  'kicker.experience': 'Experience tag', 'kicker.projects': 'Projects tag',
  'kicker.testimonials': 'Testimonials tag', 'kicker.blog': 'Blog tag',
  'kicker.faq': 'FAQ tag', 'kicker.contact': 'Contact tag',
  'kicker.stats': 'Stats tag', 'kicker.blocks': 'Why-me tag',
  'hero.badge1': 'Avatar floating badge (top-start)',
  'hero.badge2': 'Avatar floating badge (bottom-end)',
  'hero.terminal': 'Terminal lines (separate with |)',
};

export default function AdminTexts() {
  const [items, setItems] = useState<Snippet[]>([]);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [form, setForm] = useState({ key: '', value: '', valueAr: '' });
  const [adding, setAdding] = useState(false);

  const load = () => fetch('/api/snippets').then((r) => r.json()).then((map) => {
    setItems(Object.entries(map).map(([key, v]) => ({ key, value: (v as any).value, valueAr: (v as any).valueAr })));
  });
  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch('/api/snippets', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    toast('Saved');
    setEditKey(null); setAdding(false); setForm({ key: '', value: '', valueAr: '' });
    load();
  };

  const del = async (key: string) => {
    if (!confirm(`Delete "${key}"?`)) return;
    await fetch('/api/snippets', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) });
    toast('Deleted');
    load();
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; texts.manage</p>
            <h1 className="font-display text-2xl font-bold gradient-text">UI Texts & Kickers</h1>
          </div>
          <button onClick={() => { setAdding(true); setEditKey(null); setForm({ key: '', value: '', valueAr: '' }); }}
            className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> New Text</button>
        </div>

        {(adding || editKey) && (
          <div className="tech-card p-6 mb-8 space-y-4">
            <p className="text-sm" style={{ color: 'var(--accent)' }}>{adding ? '// New snippet' : `// Editing: ${editKey}`}</p>
            {adding && (
              <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="key (e.g. kicker.hero)" className="tech-input text-sm" style={{ fontFamily: 'monospace' }} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="English text" className="tech-input text-sm" />
              <input value={form.valueAr} onChange={(e) => setForm({ ...form, valueAr: e.target.value })}
                placeholder="النص العربي" dir="rtl" className="tech-input text-sm" />
            </div>
            <div className="flex gap-3">
              <button onClick={save} className="btn-primary text-sm flex items-center gap-2"><FiSave /> Save</button>
              <button onClick={() => { setAdding(false); setEditKey(null); }} className="btn-outline text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.sort((a, b) => a.key.localeCompare(b.key)).map((s) => (
            <div key={s.key} className="tech-card p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <code className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--border)' }}>{s.key}</code>
                  {LABELS[s.key] && <span className="text-xs" style={{ color: 'var(--muted)' }}>{LABELS[s.key]}</span>}
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.value}</p>
                {s.valueAr && <p className="text-sm" dir="rtl" style={{ color: 'var(--text-muted)' }}>{s.valueAr}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditKey(s.key); setAdding(false); setForm({ key: s.key, value: s.value, valueAr: s.valueAr || '' }); }}
                  className="p-2 transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-muted)' }}><FiEdit size={15} /></button>
                <button onClick={() => del(s.key)} className="p-2 transition-colors hover:text-red-400" style={{ color: 'var(--text-muted)' }}><FiTrash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
