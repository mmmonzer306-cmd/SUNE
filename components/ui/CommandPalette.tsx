'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiSearch, FiFolder, FiFileText, FiMail, FiHome } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

interface PaletteProject { id: number; name: string; nameAr?: string | null; slug?: string | null; }
interface PaletteArticle { id: number; title: string; slug: string; }

export default function CommandPalette({ projects, articles }: { projects: PaletteProject[]; articles: PaletteArticle[] }) {
  const { lang } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setActive(0);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    const base: { label: string; hint: string; icon: any; action: () => void }[] = [
      { label: lang === 'ar' ? 'الرئيسية' : 'Home', hint: 'nav', icon: FiHome, action: () => (window.location.href = '/#home') },
      { label: lang === 'ar' ? 'تواصل معي' : 'Contact me', hint: 'nav', icon: FiMail, action: () => (window.location.href = '/#contact') },
    ];
    for (const p of projects) {
      if (p.slug) base.push({ label: (lang === 'ar' && p.nameAr) ? p.nameAr : p.name, hint: 'project', icon: FiFolder, action: () => router.push(`/projects/${p.slug}`) });
    }
    for (const a of articles) {
      base.push({ label: a.title, hint: 'article', icon: FiFileText, action: () => router.push(`/blog/${a.slug}`) });
    }
    if (!q) return base;
    return base.filter((i) => i.label.toLowerCase().includes(q));
  }, [query, projects, articles, lang, router]);

  const go = (i: number) => {
    const item = items[i];
    if (!item) return;
    setOpen(false);
    item.action();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border-strong)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <FiSearch size={16} style={{ color: 'var(--accent)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  if (e.key === 'Enter') go(active);
                }}
                placeholder={lang === 'ar' ? 'ابحث عن مشروع، مقال، صفحة...' : 'Search projects, articles, pages...'}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--text)' }}
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>Esc</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {items.length === 0 && (
                <p className="text-center text-sm py-8" style={{ color: 'var(--text-muted)' }}>
                  {lang === 'ar' ? 'لا نتائج' : 'No results'}
                </p>
              )}
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={i} onMouseEnter={() => setActive(i)} onClick={() => go(i)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-start transition-colors"
                    style={{ background: i === active ? 'var(--accent-glow)' : 'transparent', color: i === active ? 'var(--accent)' : 'var(--text-muted)' }}>
                    <Icon size={15} className="shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60">{item.hint}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
