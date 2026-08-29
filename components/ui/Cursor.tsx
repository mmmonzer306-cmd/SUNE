'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Keep the ring close to the pointer without competing with page interactions.
  const ringX = useSpring(x, { stiffness: 1100, damping: 70, mass: 0.25 });
  const ringY = useSpring(y, { stiffness: 1100, damping: 70, mass: 0.25 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);

    let hoverRaf = 0;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (hoverRaf) return;
      hoverRaf = requestAnimationFrame(() => {
        hoverRaf = 0;
        const t = e.target as HTMLElement;
        setHovering(!!t.closest('a, button, .tech-card, input, textarea, select, [role="button"]'));
      });
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* dot — zero lag, rides the pointer directly */}
      <motion.div
        className="fixed top-0 left-0 z-[201] pointer-events-none rounded-full"
        style={{
          x, y,
          translateX: '-50%', translateY: '-50%',
          background: 'var(--accent)',
           mixBlendMode: 'normal',
        }}
        animate={{ width: hovering ? 10 : 7, height: hovering ? 10 : 7, scale: pressed ? 0.7 : 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />
      {/* halo — soft trailing ring */}
      <motion.div
        className="fixed top-0 left-0 z-[200] pointer-events-none rounded-full"
        style={{
          x: ringX, y: ringY,
          translateX: '-50%', translateY: '-50%',
           border: '1px solid var(--accent)',
        }}
        animate={{
          width: hovering ? 46 : 30,
          height: hovering ? 46 : 30,
           opacity: hovering ? 0.7 : 0.28,
          scale: pressed ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      />
    </>
  );
}
