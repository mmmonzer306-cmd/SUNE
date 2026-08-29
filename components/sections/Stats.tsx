'use client';
import { useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { useApp } from '@/lib/AppContext';

interface Stat { id: number; label: string; labelAr?: string | null; value: number; suffix: string; }

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`; },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Stats({ stats, snippets = {} }: { stats: Stat[]; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  if (!stats.length) return null;

  return (
    <section id="stats" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.stats', 'stats.json')} title={t('stats.title')} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.75, ease }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="tech-card skill-card-float p-8 text-center relative overflow-hidden"
              style={{ animationDelay: `${i * 0.35}s` }}
            >
              <div className="absolute top-0 inset-x-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'var(--accent-glow)',
                  border: '1px solid rgba(212,175,106,0.25)',
                  boxShadow: '0 10px 26px -8px var(--accent-glow)',
                }}>
                <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="text-4xl lg:text-5xl font-black mb-2"
                style={{
                  color: 'var(--text)',
                  textShadow: '0 0 30px var(--accent-glow)',
                }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                {(lang === 'ar' && s.labelAr) ? s.labelAr : s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
