'use client';
import { motion } from 'framer-motion';
import Kicker from '@/components/ui/Kicker';

export default function SectionHeader({ kicker, title, hint }: { kicker: string; title: string; hint?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35, margin: '-40px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      <Kicker text={kicker} />
      <h2 className="section-title mb-5">{title}</h2>
      <div className="section-ornament" />
      {hint && <p className="text-sm mt-6 max-w-xl mx-auto font-medium" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </motion.div>
  );
}
