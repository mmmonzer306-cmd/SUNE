'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useApp } from '@/lib/AppContext';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

interface Testimonial {
  id: number; name: string; role?: string | null; roleAr?: string | null;
  content: string; contentAr?: string | null; avatar?: string | null; rating: number;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Testimonials({ items, snippets = {} }: { items: Testimonial[]; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const timer = setInterval(() => {
      setDir(1);
      setIdx((i) => (i + 1) % items.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;
  const current = items[idx];
  const content = (lang === 'ar' && current.contentAr) ? current.contentAr : current.content;
  const role = (lang === 'ar' && current.roleAr) ? current.roleAr : current.role;

  const go = (next: number) => {
    setDir(next > idx || (idx === items.length - 1 && next === 0) ? 1 : -1);
    setIdx((next + items.length) % items.length);
  };

  return (
    <section id="testimonials" className="py-32 relative">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.testimonials', 'reviews.render()')} title={t('testimonials.title')} />
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current.id}
              custom={dir}
              initial={{ opacity: 0, x: dir * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -36 }}
              transition={{ duration: 0.7, ease }}
              className="tech-card skill-card-float p-10 md:p-12 text-center relative"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) go(idx + 1);
                else if (info.offset.x > 50) go(idx - 1);
              }}
            >
              <span className="text-6xl font-serif leading-none absolute top-6 start-8 opacity-20" style={{ color: 'var(--accent)' }}>&ldquo;</span>
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: Math.max(current.rating, 1) }).map((_, i) => (
                  <FiStar key={i} size={16} style={{ color: '#d4af6a', fill: '#d4af6a' }} />
                ))}
              </div>
              <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto font-medium" style={{ color: 'var(--text)' }}>
                {content}
              </p>
              <div className="flex items-center justify-center gap-3">
                {current.avatar ? (
                  <span className="relative w-12 h-12 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid var(--accent)', boxShadow: '0 8px 20px var(--accent-glow)' }}>
                    <Image src={current.avatar} alt={current.name} fill className="object-cover" />
                  </span>
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                    style={{ background: 'var(--accent-glow)', color: 'var(--accent)', boxShadow: '0 8px 20px var(--accent-glow)' }}>
                    {current.name.charAt(0)}
                  </div>
                )}
                <div className="text-start">
                  <p className="font-bold" style={{ color: 'var(--text)' }}>{current.name}</p>
                  {role && <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{role}</p>}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {items.length > 1 && (
            <>
              <button type="button" aria-label="Previous" onClick={() => go(idx - 1)}
                className="absolute top-1/2 -translate-y-1/2 -start-2 md:-start-6 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', boxShadow: '0 10px 24px var(--shadow)' }}>
                <FiChevronLeft />
              </button>
              <button type="button" aria-label="Next" onClick={() => go(idx + 1)}
                className="absolute top-1/2 -translate-y-1/2 -end-2 md:-end-6 w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', boxShadow: '0 10px 24px var(--shadow)' }}>
                <FiChevronRight />
              </button>
            </>
          )}
        </div>
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, i) => (
              <button key={i} type="button" onClick={() => go(i)} aria-label={`Testimonial ${i + 1}`}
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: i === idx ? '32px' : '8px',
                  background: i === idx ? 'var(--accent)' : 'var(--border-strong)',
                  boxShadow: i === idx ? '0 0 12px var(--accent-glow)' : 'none',
                }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
