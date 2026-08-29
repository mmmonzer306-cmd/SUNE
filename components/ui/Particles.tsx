'use client';
import { useEffect, useRef } from 'react';

interface P { x: number; y: number; vx: number; vy: number; r: number; }

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, raf = 0;
    let active = false;
    let running = false;
    const mouse = { x: -9999, y: -9999 };
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const DPR = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.25 : 1.75);
    let particles: P[] = [];
    let accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d4ff';

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
       const count = Math.min(isCoarse ? 26 : 54, Math.max(12, Math.floor((w * h) / (isCoarse ? 28000 : 19000))));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const onMove = (e: PointerEvent) => {
      if (!active || isCoarse) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    const start = () => {
      if (!active || document.hidden || running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      if (!active || document.hidden) {
        stop();
        return;
      }
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // gentle attraction toward the mouse
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 0.1) {
          p.vx += (dx / dist) * 0.012;
          p.vy += (dy / dist) * 0.012;
        }
        p.vx *= 0.99; p.vy *= 0.99;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }

      // Lines remain on desktop; mobile keeps the lighter particle layer smooth.
      if (!isCoarse) {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 120) {
              ctx.globalAlpha = (1 - d / 120) * 0.18;
              ctx.strokeStyle = accent;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) start();
      else stop();
    }, { rootMargin: '120px 0px' });
    observer.observe(canvas);
    const onVisibility = () => document.hidden ? stop() : start();

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" aria-hidden />;
}
