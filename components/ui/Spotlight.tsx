'use client';
import { useEffect } from 'react';

/** Updates --mx/--my CSS vars on .tech-card elements for the spotlight effect. */
export default function Spotlight() {
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest?.('.tech-card') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', handler, { passive: true });
    return () => window.removeEventListener('pointermove', handler);
  }, []);
  return null;
}
