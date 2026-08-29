'use client';
import { useState } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useApp } from '@/lib/AppContext';
import * as Fi from 'react-icons/fi';

interface Experience {
  id: number; title: string; titleAr?: string | null;
  org?: string | null; orgAr?: string | null;
  period?: string | null; desc?: string | null; descAr?: string | null;
  story?: string | null; storyAr?: string | null;
  icon?: string | null;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function Experience({ items, snippets = {} }: { items: Experience[]; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const [open, setOpen] = useState<number | null>(null);

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };

  if (!items.length) return null;

  return (
    <section id="experience" className="py-32 relative overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* ambient radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-96 blur-3xl pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.07), transparent 70%)' }} />

      <div className="relative max-w-4xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.experience', 'journey.log')} title={t('experience.title')}
          hint={snip('experience.hint', lang === 'ar' ? 'اضغط على أي مرحلة لقراءة القصة كاملة' : 'Click any milestone to read the full story')} />

        <div className="timeline space-y-6 ps-12">
          {items.map((item, i) => {
            const icons = Fi as unknown as Record<string, ComponentType<{ size?: number | string }>>;
            const Icon = (item.icon && icons[item.icon]) || Fi.FiBriefcase;
            const title = (lang === 'ar' && item.titleAr) ? item.titleAr : item.title;
            const org = (lang === 'ar' && item.orgAr) ? item.orgAr : item.org;
            const desc = (lang === 'ar' && item.descAr) ? item.descAr : item.desc;
            const story = (lang === 'ar' && item.storyAr) ? item.storyAr : item.story;
            const isOpen = open === item.id;
            const hasStory = !!story;

            return (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: lang === 'ar' ? 30 : -30, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* timeline node */}
                <motion.span
                  animate={isOpen ? { scale: [1, 1.25, 1], boxShadow: ['0 0 12px var(--accent-glow)', '0 0 30px var(--accent-glow)', '0 0 12px var(--accent-glow)'] } : {}}
                  transition={{ duration: 1, repeat: isOpen ? Infinity : 0 }}
                  className="timeline-dot !top-7"
                  style={isOpen ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
                />

                <motion.div
                  onClick={() => hasStory && setOpen(isOpen ? null : item.id)}
                  className={`tech-card cursor-pointer transition-all duration-500 ${isOpen ? 'p-8' : 'p-6'}`}
                  whileHover={{ y: hasStory ? -4 : 0 }}
                  style={isOpen ? { borderColor: 'var(--accent)', boxShadow: '0 20px 50px -15px var(--shadow), 0 0 40px var(--accent-glow)' } : {}}
                >
                  <div className="experience-card-header flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {/* icon avatar */}
                      <motion.div
                        animate={isOpen ? { rotate: [0, -6, 6, 0], scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.7 }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative"
                        style={{
                          background: isOpen ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--accent-glow)',
                          border: `1px solid ${isOpen ? 'transparent' : 'var(--border)'}`,
                          color: isOpen ? '#fff' : 'var(--accent)',
                          boxShadow: isOpen ? '0 10px 30px var(--accent-glow)' : 'none',
                        }}
                      >
                        <Icon size={19} />
                      </motion.div>
                      <div className="min-w-0">
                        <h3 className={`font-bold leading-tight transition-all ${isOpen ? 'text-xl gradient-text' : 'text-lg'}`}
                          style={isOpen ? {} : { color: 'var(--text)' }}>
                          {title}
                        </h3>
                        {org && <p className="text-sm mt-1 font-medium" style={{ color: 'var(--accent-2)' }}>{org}</p>}
                      </div>
                    </div>
                    <div className="experience-card-meta flex items-center gap-2 shrink-0">
                      {item.period && (
                        <span className="text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap"
                          style={{
                            background: isOpen ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg)',
                            color: isOpen ? '#fff' : 'var(--accent)',
                            border: `1px solid ${isOpen ? 'transparent' : 'var(--border)'}`,
                          }}>
                          {item.period}
                        </span>
                      )}
                      {hasStory && (
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.4 }}
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          <Fi.FiChevronDown size={13} />
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {desc && (
                    <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                  )}

                  {/* expandable story */}
                  <AnimatePresence>
                    {isOpen && hasStory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 relative" style={{ borderTop: '1px solid var(--border)' }}>
                          <div className="absolute -top-px start-0 w-20 h-px"
                            style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }} />
                          <p className="text-base leading-[1.9] whitespace-pre-line" style={{ color: 'var(--text)' }}>
                            {story}
                          </p>
                          <p className="text-xs mt-4 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                            ✦ {snip('experience.storyLabel', lang === 'ar' ? 'قصة المرحلة' : 'Story of this phase')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {hasStory && !isOpen && (
                    <p className="text-xs mt-3 uppercase tracking-widest opacity-60" style={{ color: 'var(--accent)' }}>
                      {snip('experience.readMore', lang === 'ar' ? '+ اقرأ القصة الكاملة' : '+ Read the full story')}
                    </p>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
