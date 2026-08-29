'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { FiSun, FiMoon, FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function Navbar({ snippets = {} }: { snippets?: Snippets }) {
  const { theme, toggleTheme, lang, setLang, t } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [active, setActive] = useState('home');
  const snip = (key: string, fallback: string) => {
    const value = snippets[key];
    return value ? (lang === 'ar' && value.valueAr ? value.valueAr : value.value) : fallback;
  };
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ids = ['home', 'about', 'skills', 'services', 'projects', 'blog', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: '#home', id: 'home', label: snip('nav.home', t('nav.home')) },
    { href: '#about', id: 'about', label: snip('nav.about', t('nav.about')) },
    { href: '#skills', id: 'skills', label: snip('nav.skills', t('nav.skills')) },
    { href: '#services', id: 'services', label: snip('nav.services', t('services.title')) },
    { href: '#projects', id: 'projects', label: snip('nav.projects', t('nav.works')) },
    { href: '/blog', id: 'blog', label: snip('nav.blog', t('nav.blog')) },
    { href: '#contact', id: 'contact', label: snip('nav.contact', t('nav.contact')) },
  ];

  const langs = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'ar', label: 'AR', full: 'العربية' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50"
    >
      {/* Scroll progress */}
      <motion.div
        className="h-[3px] origin-left"
        style={{
          scaleX: progress,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-2), var(--accent))',
          backgroundSize: '200% 100%',
          boxShadow: '0 0 16px var(--accent-glow), 0 0 32px var(--accent-glow)',
        }}
      />

      <motion.nav
        animate={{
          backdropFilter: scrolled ? 'blur(20px) saturate(1.4)' : 'blur(0px)',
        }}
        transition={{ duration: 0.4 }}
        className="transition-all duration-500"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 10px 40px -12px var(--shadow)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 shrink-0">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              className="font-display text-xl font-black tracking-widest"
            >
              <span style={{ color: 'var(--accent)' }}>{snip('brand.mark', 'MM')}</span>
            </motion.span>
            <span className="text-sm font-light hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{snip('brand.suffix', '_dev')}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <Link key={link.href} href={link.href}
                  className="relative px-3.5 py-2 text-[13px] uppercase tracking-widest transition-colors duration-300 rounded-lg"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {link.label}
                  {/* underline beam */}
                  <motion.span
                    className="absolute bottom-0.5 start-3.5 end-3.5 h-[2px] rounded-full origin-left"
                    style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
                    initial={false}
                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {/* hover glow */}
                  <span className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'var(--accent-glow)' }} />
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <a href="#contact"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-105"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full opacity-60" style={{ background: '#22c55e' }} />
                <span className="relative rounded-full h-2 w-2" style={{ background: '#22c55e' }} />
              </span>
              {snip('nav.available', t('available'))}
            </a>

            <button onClick={toggleTheme}
              className="p-2 rounded-xl transition-all hover:scale-110 active:scale-95 hover:shadow-lg"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="block"
              >
                {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
              </motion.span>
            </button>

            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all hover:scale-105 active:scale-95"
                style={{ color: 'var(--accent)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <FiGlobe size={14} />
                {lang.toUpperCase()}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-12 end-0 rounded-xl overflow-hidden shadow-2xl z-50"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', minWidth: '130px' }}
                  >
                    {langs.map((l) => (
                      <button key={l.code} onClick={() => { setLang(l.code as 'en' | 'ar'); setLangOpen(false); }}
                        className="w-full px-4 py-2.5 text-sm text-start flex items-center justify-between transition-colors"
                        style={{
                          color: lang === l.code ? 'var(--accent)' : 'var(--text-muted)',
                          background: lang === l.code ? 'var(--accent-glow)' : 'transparent',
                        }}>
                        <span>{l.full}</span>
                        <span className="text-xs opacity-60">{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#contact" className="hidden lg:block btn-primary text-sm py-2.5 px-5">
              {snip('nav.cta', t('hire'))}
            </a>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl"
              style={{ color: 'var(--accent)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <motion.span key={menuOpen ? 'x' : 'm'} initial={{ rotate: -90 }} animate={{ rotate: 0 }} className="block">
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
            >
              <div className="px-6 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link href={link.href} onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-3 px-3 rounded-xl text-sm uppercase tracking-widest transition-colors"
                      style={{
                        color: active === link.id ? 'var(--accent)' : 'var(--text-muted)',
                        background: active === link.id ? 'var(--accent-glow)' : 'transparent',
                      }}>
                      {link.label}
                      {active === link.id && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />}
                    </Link>
                  </motion.div>
                ))}
                <a href="#contact" onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center mt-3 text-sm">
                  {t('hire')}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </motion.header>
  );
}
