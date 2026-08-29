'use client';
import { motion } from 'framer-motion';

/** Luxury floating kicker: glowing pill with shimmer, floating chevron, pulsing dot */
export default function Kicker({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-block mb-4 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative inline-flex items-center gap-2.5 px-5 py-2 rounded-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--card)), color-mix(in srgb, var(--accent-2) 10%, var(--card)))',
          border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
          boxShadow: '0 0 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.06)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* sweeping shine */}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.14) 50%, transparent 60%)',
          }}
          animate={{ x: ['-120%', '120%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.8 }}
        />

        {/* floating chevron */}
        <motion.span
          animate={{ x: [0, 3, 0], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="font-black text-base"
          style={{ color: 'var(--accent)', textShadow: '0 0 10px var(--accent-glow)' }}
        >
          &gt;
        </motion.span>

        <span className="text-xs md:text-sm font-bold tracking-[0.22em] uppercase"
          style={{
            background: 'linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent))',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            animation: 'kickerGrad 4s linear infinite',
          }}>
          {text}
        </span>

        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }}
        />
      </motion.div>
    </motion.div>
  );
}

export function useSnippetGetter(snippets: Record<string, { value: string; valueAr: string | null }>, lang: string) {
  return (key: string, fallback: string) => {
    const s = snippets[key];
    if (!s) return fallback;
    return (lang === 'ar' && s.valueAr) ? s.valueAr : s.value;
  };
}
