'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/AppContext';
import { SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiPostgresql, SiPrisma, SiTailwindcss, SiDocker, SiGraphql, SiRedis } from 'react-icons/si';

// Each tech gets its own playful click animation
const TECHS: { icon: any; name: string; anim: Record<string, any>; color: string }[] = [
  { icon: SiReact, name: 'React', color: '#61dafb', anim: { rotate: 360, scale: [1, 1.4, 1] } },
  { icon: SiNextdotjs, name: 'Next.js', color: '#ffffff', anim: { x: [0, 20, 0], scale: [1, 1.25, 1] } },
  { icon: SiNodedotjs, name: 'Node.js', color: '#3c873a', anim: { y: [0, -16, 0], scale: [1, 1.3, 1] } },
  { icon: SiTypescript, name: 'TypeScript', color: '#3178c6', anim: { rotate: [0, -12, 12, -12, 0], scale: [1, 1.25, 1] } },
  { icon: SiPostgresql, name: 'PostgreSQL', color: '#58a6ff', anim: { rotate: [0, -18, 0], y: [0, -12, 0], scale: [1, 1.35, 1] } },
  { icon: SiPrisma, name: 'Prisma', color: '#a855f7', anim: { scaleY: [1, 0.6, 1.2, 1], scaleX: [1, 1.2, 0.85, 1] } },
  { icon: SiTailwindcss, name: 'Tailwind', color: '#38bdf8', anim: { x: [0, 8, -8, 6, 0], rotate: [0, 8, -8, 0] } },
  { icon: SiDocker, name: 'Docker', color: '#2496ed', anim: { y: [0, -20, 0], rotate: [0, 14, 0] } },
  { icon: SiGraphql, name: 'GraphQL', color: '#e535ab', anim: { scale: [1, 0.8, 1.35, 1], rotate: [0, 180, 360] } },
  { icon: SiRedis, name: 'Redis', color: '#dc382d', anim: { rotate: [0, 0, 26, 0], scale: [1, 1.25, 1] } },
];

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function Marquee({ snippets = {} }: { snippets?: Snippets }) {
  const { t, lang } = useApp();
  const [clicks, setClicks] = useState<Record<number, number>>({});
  const [burst, setBurst] = useState<{ id: number; x: number; y: number; color: string } | null>(null);
  const hint = snippets['marquee.hint'];
  const hintText = hint ? (lang === 'ar' && hint.valueAr ? hint.valueAr : hint.value) : (lang === 'ar' ? 'اضغط على الأيقونات - إنها تلعب!' : 'Click the icons - they play!');
  const items = [...TECHS, ...TECHS];

  const play = (e: React.MouseEvent, i: number, color: string) => {
    const next = (clicks[i] || 0) + 1;
    setClicks((c) => ({ ...c, [i]: next }));
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setBurst({ id: Date.now(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, color });
    setTimeout(() => setBurst(null), 800);
  };

  return (
    <div className="py-12 marquee marquee-mask overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <p className="text-center text-xs uppercase tracking-[0.3em] mb-2 font-bold" style={{ color: 'var(--text-muted)' }}>
        {t('marquee.title')}
      </p>
      <p className="text-center text-[11px] mb-8 font-medium" style={{ color: 'var(--accent)' }}>
        {hintText}
      </p>
      <div className="marquee-track gap-5 items-center !py-2">
        {items.map((tech, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={(e) => play(e, i, tech.color)}
            animate={clicks[i] ? { ...tech.anim } : { rotate: 0, x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 14 }}
            whileHover={{ y: -6, scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-3 shrink-0 px-5 py-3 rounded-2xl cursor-pointer transition-shadow relative select-none marquee-pill"
            style={{
              background: 'var(--card)',
              border: `1px solid ${tech.color}33`,
              boxShadow: `0 10px 24px -12px ${tech.color}55, 0 0 0 1px rgba(255,255,255,0.03) inset`,
              touchAction: 'manipulation',
            }}
          >
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: (i % TECHS.length) * 0.25 }}
              className="flex"
            >
              <tech.icon size={24} style={{ color: tech.color, filter: `drop-shadow(0 0 6px ${tech.color}88)` }} />
            </motion.span>
            <span className="text-sm font-bold tracking-wide" style={{ color: 'var(--text)' }}>{tech.name}</span>
          </motion.button>
        ))}
      </div>

      {/* click burst particles */}
      <AnimatePresence>
        {burst && (
          <div key={burst.id} className="fixed z-[210] pointer-events-none" style={{ left: burst.x, top: burst.y }}>
            {[...Array(10)].map((_, i) => (
              <motion.span key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ background: burst.color, left: 0, top: 0, boxShadow: `0 0 10px ${burst.color}` }}
                initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos((i / 10) * Math.PI * 2) * 52,
                  y: Math.sin((i / 10) * Math.PI * 2) * 52,
                  scale: 0, opacity: 0,
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
