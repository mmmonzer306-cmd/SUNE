'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import Image from 'next/image';
import SectionHeader from './SectionHeader';

interface Skill {
  id: number; name: string; nameAr: string | null;
  description: string | null; descAr: string | null;
  level: number; imageUrl: string | null; category: string;
}

const CATEGORIES = ['all', 'frontend', 'backend', 'tools', 'other'];

function LevelCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.6, ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = `${Math.round(v)}%`; },
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>0%</span>;
}

export default function Skills({ skills, snippets = {} }: { skills: Skill[]; snippets?: Record<string, { value: string; valueAr: string | null }> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t, lang } = useApp();
  const [category, setCategory] = useState('all');

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  const getName = (s: Skill) => (lang === 'ar' && s.nameAr) ? s.nameAr : s.name;
  const getDesc = (s: Skill) => (lang === 'ar' && s.descAr) ? s.descAr : s.description;

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: skills.length };
    for (const s of skills) map[s.category] = (map[s.category] || 0) + 1;
    return map;
  }, [skills]);

  const available = CATEGORIES.filter((c) => c === 'all' || (counts[c] || 0) > 0);
  const filtered = category === 'all' ? skills : skills.filter((s) => s.category === category);

  const catLabels: Record<string, { en: string; ar: string }> = {
    all: { en: 'All', ar: 'الكل' },
    frontend: { en: 'Frontend', ar: 'واجهات' },
    backend: { en: 'Backend', ar: 'خوادم' },
    tools: { en: 'Tools', ar: 'أدوات' },
    other: { en: 'Other', ar: 'أخرى' },
  };

  return (
    <section id="skills" className="py-32 relative overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* background glows */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-0 start-1/4 w-[500px] h-72 blur-3xl pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.07), transparent 70%)' }} />
      <div className="absolute bottom-0 end-1/4 w-[420px] h-60 blur-3xl pointer-events-none opacity-50"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.skills', 'skills.exe')} title={t('skills.title')} />

        {/* Category filters — luxury pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2.5 mb-14">
          {available.map((c) => {
            const active = category === c;
            return (
              <motion.button
                key={c} onClick={() => setCategory(c)}
                type="button"
                whileTap={{ scale: 0.96 }}
                className="relative px-5 py-2.5 rounded-full text-sm transition-all duration-300 cursor-pointer select-none"
                style={{
                  background: active ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'color-mix(in srgb, var(--card) 70%, transparent)',
                  color: active ? '#fff' : 'var(--text-muted)',
                  border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                  fontWeight: active ? 700 : 500,
                  boxShadow: active ? '0 8px 24px var(--accent-glow)' : 'none',
                  backdropFilter: 'blur(8px)',
                  touchAction: 'manipulation',
                }}>
                {lang === 'ar' ? catLabels[c].ar : catLabels[c].en}
                <span className={`ms-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : ''}`}
                  style={active ? {} : { background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  {counts[c] || 0}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => (
              <motion.div key={skill.id} layout
                initial={{ opacity: 0, y: 34, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="tech-card group relative p-7 overflow-hidden"
                style={{ background: 'linear-gradient(160deg, var(--card), color-mix(in srgb, var(--card) 90%, var(--accent-2) 10%))' }}
              >
                {/* corner glow on hover */}
                <div className="absolute -top-16 -end-16 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }} />

                {skill.imageUrl && (
                  <div className="relative h-36 rounded-xl overflow-hidden mb-5">
                    <Image src={skill.imageUrl} alt={getName(skill)} fill sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[0.5deg]" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--card), transparent)' }} />
                    {/* level badge on image */}
                    <span className="absolute top-3 end-3 text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-md"
                      style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.35)' }}>
                      {skill.level}%
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{getName(skill)}</h3>
                  <span className="font-display font-black text-sm gradient-text">
                    <LevelCounter value={skill.level} />
                  </span>
                </div>

                {getDesc(skill) && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{getDesc(skill)}</p>
                )}

                <div className="skill-bar mt-2">
                  <motion.div className="skill-bar-fill"
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${skill.level}%` } : { width: '0%' }}
                    transition={{ duration: 1.3, delay: i * 0.05 + 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
