'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import Image from 'next/image';

interface Skill {
  id: number; name: string; nameAr: string | null; nameFr: string | null;
  description: string | null; descAr: string | null; descFr: string | null;
  level: number; imageUrl: string | null;
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t, lang } = useApp();

  const getName = (s: Skill) => (lang === 'ar' && s.nameAr) ? s.nameAr : (lang === 'fr' && s.nameFr) ? s.nameFr : s.name;
  const getDesc = (s: Skill) => (lang === 'ar' && s.descAr) ? s.descAr : (lang === 'fr' && s.descFr) ? s.descFr : s.description;

  return (
    <section id="skills" className="py-32 relative" style={{ background: 'var(--surface)' }}>
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-20">
          <p className="font-mono text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>
            &gt; skills.exe
          </p>
          <h2 className="section-title gradient-text mb-4">{t('skills.title')}</h2>
          <div className="w-24 h-px mx-auto" style={{ background: `linear-gradient(to right, transparent, var(--accent), transparent)` }} />
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, i) => (
            <motion.div key={skill.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="tech-card p-6 group">
              {/* Skill Image */}
              {skill.imageUrl && (
                <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                  <Image src={skill.imageUrl} alt={getName(skill)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--card), transparent)' }} />
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{getName(skill)}</h3>
                <span className="font-mono font-bold text-sm" style={{ color: 'var(--accent)' }}>{skill.level}%</span>
              </div>
              {getDesc(skill) && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{getDesc(skill)}</p>
              )}
              <div className="skill-bar">
                <motion.div className="skill-bar-fill"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: i * 0.08 + 0.3, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
