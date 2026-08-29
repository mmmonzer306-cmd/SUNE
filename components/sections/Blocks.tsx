'use client';
import { useEffect, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useApp } from '@/lib/AppContext';
import * as Fi from 'react-icons/fi';

interface Block {
  id: number; title: string; titleAr?: string | null;
  text?: string | null; textAr?: string | null;
  icon?: string | null;
}

function TiltCard({ block, index, lang }: { block: Block; index: number; lang: string }) {
  const [hovered, setHovered] = useState(false);
  const canHoverRef = useRef(false);
  useEffect(() => {
    const m = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onChange = () => { canHoverRef.current = m.matches; };
    onChange();
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (!canHoverRef.current) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(py * -8);
    ry.set(px * 10);
  };
  const onLeave = () => { rx.set(0); ry.set(0); setHovered(false); };
  const enter = () => { if (canHoverRef.current) setHovered(true); };

  const icons = Fi as unknown as Record<string, ComponentType<{ size?: number | string }>>;
  const Icon = (block.icon && icons[block.icon]) || Fi.FiZap;
  const title = (lang === 'ar' && block.titleAr) ? block.titleAr : block.title;
  const text = (lang === 'ar' && block.textAr) ? block.textAr : block.text;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 120, damping: 16 }}
      style={{ perspective: 900 }}
    >
       <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={enter}
        onPointerLeave={onLeave}
        onClick={() => { if (!canHoverRef.current) setHovered((h) => !h); }}
        animate={{ y: hovered ? -8 : [0, -6, 0] }}
        transition={hovered ? { duration: 0.3 } : { duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="tech-card relative h-full p-7 overflow-hidden cursor-pointer"
      >
        {/* sweeping gradient border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.12), transparent 45%, rgba(124,58,237,0.12))',
          }}
        />

        {/* big icon with orbit */}
        <div className="relative w-14 h-14 mb-5" style={{ transform: 'translateZ(30px)' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: hovered ? 3 : 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1.5 rounded-2xl border border-dashed"
            style={{ borderColor: hovered ? 'var(--accent)' : 'var(--border-strong)' }}
          />
          <motion.div
            animate={hovered ? { scale: 1.12, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--accent-glow), transparent)',
              border: '1px solid var(--border)',
              boxShadow: hovered ? '0 0 24px var(--accent-glow)' : 'none',
            }}
          >
            <Icon size={22} />
          </motion.div>
        </div>

        <h3 className="font-bold text-lg mb-2 transition-colors"
          style={{ color: 'var(--text)', transform: 'translateZ(20px)' }}>
          {title}
        </h3>
        {text && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', transform: 'translateZ(10px)' }}>
            {text}
          </p>
        )}

        {/* corner index watermark */}
        <span className="absolute top-4 end-5 font-display text-4xl font-black opacity-[0.07] select-none"
          style={{ color: 'var(--text)' }}>
          0{index + 1}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Blocks({ blocks, snippets = {} }: { blocks: Block[]; snippets?: Record<string, { value: string; valueAr: string | null }> }) {
  const { lang } = useApp();
  if (!blocks.length) return null;

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };

  return (
    <section id="blocks" className="py-28 relative overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-72 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.06), transparent 70%)' }} />
      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          kicker={snip('kicker.blocks', 'why-me.config')}
          title={snip('blocks.title', lang === 'ar' ? 'لماذا تختارني' : 'Why Work With Me')}
          hint={snip('blocks.hint', lang === 'ar' ? 'المزايا التي أقدمها في كل مشروع' : 'The advantages you get with every project')}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blocks.map((b, i) => <TiltCard key={b.id} block={b} index={i} lang={lang} />)}
        </div>
      </div>
    </section>
  );
}
