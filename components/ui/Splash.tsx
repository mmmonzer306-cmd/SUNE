'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiArrowDown, FiArrowUpRight, FiCommand } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

type Phase = 'splash' | 'intro' | 'entering' | 'done';
type Snippets = Record<string, { value: string; valueAr: string | null }>;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Splash({ snippets = {} }: { snippets?: Snippets }) {
  const [phase, setPhase] = useState<Phase>('splash');
  const finishTimer = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const { lang } = useApp();
  const snip = (key: string, fallback: string) => {
    const value = snippets[key];
    return value ? (lang === 'ar' && value.valueAr ? value.valueAr : value.value) : fallback;
  };

  useEffect(() => {
    if (sessionStorage.getItem('splash-shown') === '2') {
      setPhase('done');
      return;
    }

    document.body.style.overflow = 'hidden';
    const introTimer = window.setTimeout(() => setPhase('intro'), reducedMotion ? 900 : 2600);

    return () => {
      window.clearTimeout(introTimer);
      if (finishTimer.current) window.clearTimeout(finishTimer.current);
      document.body.style.overflow = '';
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (phase === 'done') document.body.style.overflow = '';
  }, [phase]);

  const enter = () => {
    sessionStorage.setItem('splash-shown', '2');
    setPhase('entering');
    finishTimer.current = window.setTimeout(() => setPhase('done'), reducedMotion ? 80 : 950);
  };

  const skip = () => {
    sessionStorage.setItem('splash-shown', '2');
    setPhase('done');
    document.body.style.overflow = '';
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          data-splash-overlay
          className="splash-shell"
          initial={reducedMotion ? false : { opacity: 1 }}
          animate={{ opacity: phase === 'entering' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.08 : 0.7, ease }}
          aria-label="Portfolio introduction"
        >
          <div className="splash-grid" />
          <div className="splash-noise" />
          <div className="splash-orbit splash-orbit-one" />
          <div className="splash-orbit splash-orbit-two" />
          <div className="splash-orbit splash-orbit-three" />
          <div className="splash-corner splash-corner-top">{snip('splash.cornerTop', 'MM / 01')}</div>
          <div className="splash-corner splash-corner-bottom">{snip('splash.cornerBottom', 'DIGITAL CRAFT / 2026')}</div>

          <div className="splash-content">
            <AnimatePresence mode="wait" initial={false}>
              {phase === 'splash' ? (
                <motion.section
                  key="brand"
                  className="splash-brand"
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -26, scale: 0.97 }}
                  transition={{ duration: reducedMotion ? 0.1 : 0.7, ease }}
                  aria-live="polite"
                >
                  <div className="splash-mark-wrap" aria-hidden="true">
                    {/* Pure CSS rotation — framer-motion keyframes here caused a
                        hydration mismatch (SSR wrote rotate(360deg)) */}
                    <div className="splash-mark-shadow" />
                    <motion.div
                      className="splash-mark"
                      initial={reducedMotion ? false : { scale: 0.65, rotate: -12 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: reducedMotion ? 0.1 : 0.9, delay: 0.12, type: 'spring', stiffness: 110, damping: 15 }}
                    >
                      <span>{snip('brand.mark', 'MM')}</span>
                    </motion.div>
                    <span className="splash-mark-line splash-mark-line-left" />
                    <span className="splash-mark-line splash-mark-line-right" />
                  </div>

                  <p className="splash-eyebrow">{snip('splash.brandEyebrow', 'ALEX MORGAN / PORTFOLIO')}</p>
                  <h1 className="splash-name">{snip('splash.firstName', 'Mohammed')} <em>{snip('splash.lastName', 'Mohsen')}</em></h1>
                  <p className="splash-role">{snip('splash.role', 'Full-Stack Developer')} <span>/</span> {snip('splash.roleSuffix', 'Digital Craftsman')}</p>

                  <div className="splash-loader" aria-label="Loading portfolio">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: reducedMotion ? 0.1 : 2.15, ease: 'linear' }}
                    />
                  </div>
                  <div className="splash-loader-meta"><span>{snip('splash.loading', 'Preparing experience')}</span><span>01 / 02</span></div>
                </motion.section>
              ) : (
                <motion.section
                  key="intro"
                  className="splash-intro"
                  initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: phase === 'entering' ? 0 : 1, y: phase === 'entering' ? -30 : 0 }}
                  transition={{ duration: reducedMotion ? 0.1 : 0.65, ease }}
                >
                  <div className="splash-intro-top">
                    <span className="splash-status"><i /> {snip('splash.status', 'Available for meaningful work')}</span>
                    <span className="splash-index">02 / 02</span>
                  </div>
                  <p className="splash-eyebrow">{snip('splash.introEyebrow', 'WELCOME TO THE WORKSPACE')}</p>
                  <h1 className="splash-headline">
                    {snip('splash.headlineLine1', 'Ideas, shaped')}<br />
                    {snip('splash.headlineLine2', 'into')} <span>{snip('splash.headlineAccent', 'experiences.')}</span>
                  </h1>
                  <p className="splash-copy">{snip('splash.description', 'Thoughtful interfaces, reliable systems, and digital products built to make an impression.')}</p>

                  <div className="splash-actions">
                    <motion.button
                      type="button"
                      className="splash-enter"
                      onClick={enter}
                      whileHover={reducedMotion ? undefined : { scale: 1.025, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      autoFocus
                    >
                      <span>{snip('splash.enter', 'Explore the portfolio')}</span>
                      <FiArrowUpRight aria-hidden="true" />
                    </motion.button>
                    <button type="button" className="splash-skip" onClick={skip}>
                      <FiCommand aria-hidden="true" /> {snip('splash.skip', 'Skip intro')} <span>ESC</span>
                    </button>
                  </div>

                  <div className="splash-intro-footer">
                    <span>{snip('splash.scroll', 'Scroll to discover')}</span>
                    <motion.span animate={reducedMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <FiArrowDown aria-hidden="true" />
                    </motion.span>
                    <span>{snip('splash.languages', 'EN / AR')}</span>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <div className="splash-side-note splash-side-note-left">{snip('splash.sideLeft', 'SELECTED WORKS')}<br />&amp; {snip('splash.sideLeftSecond', 'SYSTEMS')}</div>
          <div className="splash-side-note splash-side-note-right">{snip('splash.sideRight', 'SCROLL / ENTER')}<br />{snip('splash.sideRightSecond', 'TO BEGIN')}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
