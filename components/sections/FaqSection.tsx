'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useApp } from '@/lib/AppContext';
import { FiPlus, FiMinus } from 'react-icons/fi';

interface Faq { id: number; q: string; qAr?: string | null; a: string; aAr?: string | null; }

type Snippets = Record<string, { value: string; valueAr: string | null }>;
const ease = [0.22, 1, 0.36, 1] as const;

export default function FaqSection({ items, snippets = {} }: { items: Faq[]; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  const [open, setOpen] = useState<number | null>(items[0]?.id ?? null);
  if (!items.length) return null;

  return (
    <section id="faq" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.faq', 'faq.md')} title={t('faq.title')} />
        <div className="space-y-4">
          {items.map((item, i) => {
            const q = (lang === 'ar' && item.qAr) ? item.qAr : item.q;
            const a = (lang === 'ar' && item.aAr) ? item.aAr : item.a;
            const isOpen = open === item.id;
            const n = String(i + 1).padStart(2, '0');
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.07, duration: 0.7, ease }}
                className={`tech-card faq-item overflow-hidden ${isOpen ? 'is-open' : ''}`}
                style={isOpen ? { boxShadow: '0 22px 48px -16px var(--shadow), 0 0 28px var(--accent-glow)' } : undefined}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-4 p-6 md:p-7 text-start"
                >
                  <span className="text-xs font-bold tracking-[0.2em]" style={{ color: 'var(--accent)' }}>{n}</span>
                  <span className="font-bold text-base md:text-lg flex-1" style={{ color: isOpen ? 'var(--text)' : 'var(--text)' }}>{q}</span>
                  <span
                    className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      background: isOpen ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--accent-glow)',
                      color: isOpen ? 'var(--bg)' : 'var(--accent)',
                      boxShadow: isOpen ? '0 8px 18px var(--accent-glow)' : 'none',
                    }}
                  >
                    {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                  </span>
                </button>
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="px-6 md:px-7 pb-7 ps-16 md:ps-[4.5rem] text-[15px] leading-relaxed font-medium" style={{ color: 'var(--text-muted)' }}>
                      {a}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
