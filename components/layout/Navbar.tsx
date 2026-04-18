'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

export default function Navbar() {
  const { theme, toggleTheme, lang, setLang, t } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#skills', label: t('nav.skills') },
    { href: '#projects', label: t('nav.works') },
    { href: '/blog', label: t('nav.blog') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const langs = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'ar', label: 'AR', full: 'العربية' },
    { code: 'fr', label: 'FR', full: 'Français' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md border-b' : ''}`}
      style={{ borderColor: 'var(--border)', background: scrolled ? 'var(--nav-bg)' : 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-black tracking-widest shrink-0">
          <span style={{ color: 'var(--accent)' }}>MM</span>
          <span style={{ color: 'var(--text-muted)' }} className="text-sm ml-1">_dev</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="text-sm font-mono uppercase tracking-wider relative group transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ background: 'var(--accent)' }} />
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:scale-110"
            style={{ color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}
            title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          >
            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-mono transition-all"
              style={{ color: 'var(--accent)', background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <FiGlobe size={14} />
              {lang.toUpperCase()}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 right-0 rounded-lg overflow-hidden shadow-xl z-50"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', minWidth: '120px' }}
                >
                  {langs.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code as 'en'|'ar'|'fr'); setLangOpen(false); }}
                      className="w-full px-4 py-2.5 text-sm font-mono text-left flex items-center justify-between transition-colors"
                      style={{
                        color: lang === l.code ? 'var(--accent)' : 'var(--text-muted)',
                        background: lang === l.code ? 'var(--accent-glow)' : 'transparent',
                      }}
                    >
                      <span>{l.full}</span>
                      <span className="text-xs opacity-60">{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hire Me */}
          <a href="#contact" className="hidden md:block btn-primary text-sm py-2 px-4">
            {t('hire')}
          </a>

          {/* Mobile Menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: 'var(--accent)' }}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-6"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="block py-3 font-mono text-sm uppercase tracking-wider transition-colors"
                style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
