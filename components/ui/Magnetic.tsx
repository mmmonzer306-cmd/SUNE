'use client';
import { useRef, ReactNode, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Magnetic({ children, strength = 12 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.35 });

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * Math.min(strength, 7));
    y.set(((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * Math.min(strength, 7));
  };

  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onPointerMove={enabled ? onMove : undefined} onPointerLeave={enabled ? onLeave : undefined}
      style={enabled ? { x: sx, y: sy, display: 'inline-block', willChange: 'transform' } : { display: 'inline-block' }}>
      {children}
    </motion.div>
  );
}
