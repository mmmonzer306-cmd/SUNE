'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { FiGithub, FiFacebook, FiSend, FiDownload, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';
import Particles from '@/components/ui/Particles';
import Magnetic from '@/components/ui/Magnetic';

interface Profile {
  name: string; title: string; titleAr?: string;
  github?: string; facebook?: string; telegram?: string; whatsapp?: string;
  linkedin?: string; twitter?: string;
  avatarUrl?: string; resumeUrl?: string;
  tagline?: string; taglineAr?: string;
  location?: string; locationAr?: string;
  availability?: string; availabilityAr?: string;
}

const typingTexts: Record<string, string[]> = {
  en: ['Full-stack Web Developer', 'React Specialist', 'Next.js Developer', 'UI/UX Enthusiast'],
  ar: ['مطور ويب متكامل', 'متخصص رياكت', 'مطور Next.js', 'مهتم بتجربة المستخدم'],
};

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function Hero({ profile, snippets = {} }: { profile: Profile; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const [displayed, setDisplayed] = useState('');
  const [titleIdx, setTitleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [burst, setBurst] = useState(false);
  const titles = typingTexts[lang as 'en' | 'ar'] || typingTexts.en;

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  const badge1 = snip('hero.badge1', '<Code />');
  const badge2 = snip('hero.badge2', 'Full-Stack ✓');
  const terminalLines = snip('hero.terminal', '').split('|').filter(Boolean);
  const greeting = snip('kicker.home', t('hero.greeting'));

  useEffect(() => {
    setDisplayed('');
    setTitleIdx(0);
    setDeleting(false);
  }, [lang]);

  useEffect(() => {
    const current = titles[titleIdx];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    } else if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      return () => clearTimeout(t);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % titles.length);
    }
  }, [displayed, deleting, titleIdx, titles]);

  const socials = [
    { icon: FiGithub, href: profile.github, label: 'GitHub' },
    { icon: FiFacebook, href: profile.facebook, label: 'Facebook' },
    { icon: FiSend, href: profile.telegram, label: 'Telegram' },
    { icon: FaWhatsapp, href: profile.whatsapp, label: 'WhatsApp' },
    { icon: FaLinkedinIn, href: profile.linkedin, label: 'LinkedIn' },
  ].filter((s) => s.href);

  return (
    <section id="home" className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Interactive particle canvas */}
      <Particles />
      {/* Ambient blobs */}
      <div className="hero-ambient absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)' }} />
      <div className="hero-ambient absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)', animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className={`flex-1 text-center ${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mb-4">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
              style={{
                color: 'var(--accent)',
                background: 'var(--accent-glow)',
                border: '1px solid rgba(0,212,255,0.2)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}>
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="font-bold">&gt;</motion.span>
              {greeting}
              <span className="w-1.5 h-3.5 animate-pulse inline-block" style={{ background: 'var(--accent)' }} />
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-display text-5xl lg:text-7xl font-black mb-4 tracking-tight" style={{ color: 'var(--text)' }}>
            {profile.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl  mb-6 h-10 flex items-center gap-1"
            style={{ justifyContent: 'center' }}
          >
            <span className="gradient-text font-bold">{displayed}</span>
            <span style={{ color: 'var(--accent)' }} className="animate-pulse">|</span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="max-w-xl mx-auto lg:mx-0 leading-relaxed mb-4 text-lg"
            style={{ color: 'var(--text-muted)' }}>
            {(lang === 'ar' && profile.taglineAr) ? profile.taglineAr : (profile.tagline || t('hero.description'))}
          </motion.p>

          {(profile.location || profile.availability) && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-3 mb-10 justify-center lg:justify-start">
              {profile.location && (
                <span className="text-xs px-3 py-1.5 rounded-full" style={{ color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  📍 {(lang === 'ar' && profile.locationAr) ? profile.locationAr : profile.location}
                </span>
              )}
              {profile.availability && (
                <span className="text-xs px-3 py-1.5 rounded-full tag-accent">
                  {(lang === 'ar' && profile.availabilityAr) ? profile.availabilityAr : profile.availability}
                </span>
              )}
            </motion.div>
          )}

          {/* Mini terminal */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="tech-card max-w-xl mx-auto lg:mx-0 mb-10 text-left overflow-hidden" dir="ltr">
            <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
              <span className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
              <span className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
              <span className="ml-2 text-xs" style={{ color: 'var(--muted)', fontFamily: 'monospace' }}>~/mohammed — zsh</span>
            </div>
            <div
              className="px-4 py-3 text-sm cursor-pointer select-none transition-transform hover:scale-[1.01]"
              style={{ fontFamily: 'monospace' }}
              onClick={() => setBurst(true)}
              title="Click me"
            >
              {terminalLines.length > 0 ? terminalLines.map((line, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.4 }}
                  style={{ color: line.trim().startsWith('✓') ? '#4ade80' : 'var(--text-muted)' }}>
                  {line.trim().startsWith('$') ? <><span style={{ color: 'var(--accent)' }}>$</span>{line.trim().slice(1)}</> : line}
                  {i === terminalLines.length - 1 && <span className="animate-pulse ms-1" style={{ color: 'var(--accent)' }}>▋</span>}
                </motion.p>
              )) : (
                <p style={{ color: 'var(--text-muted)' }}><span style={{ color: 'var(--accent)' }}>$</span> whoami</p>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
            <Magnetic>
              <a href="#contact" className="btn-primary gap-2">
                {t('hero.button1')} <FiArrowRight />
              </a>
            </Magnetic>
            {profile.resumeUrl && (
              <Magnetic strength={8}>
                <a href={profile.resumeUrl} download className="btn-outline gap-2">
                  <FiDownload /> {t('downloadCV')}
                </a>
              </Magnetic>
            )}
          </motion.div>

          {/* Socials */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex gap-4 justify-center lg:justify-start">
            {socials.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-all hover:scale-110 hover:-translate-y-1"
                style={{ color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)' }}
                title={label}>
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-72 h-72 lg:w-96 lg:h-96 shrink-0">
          {/* layered luxury halo */}
          <div className="absolute -inset-6 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.25), rgba(124,58,237,0.16) 50%, transparent 72%)' }} />
          {/* solid + dashed orbit rings */}
          <div className="hero-orbit absolute inset-0 rounded-full animate-spin"
            style={{
              animationDuration: '24s',
              border: '1px dashed rgba(0,212,255,0.25)',
            }} />
          <div className="hero-orbit absolute inset-0 rounded-full animate-spin"
            style={{
              animationDuration: '24s',
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(0,212,255,0.5) 85%, transparent 100%)',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            }} />
          <div className="hero-orbit absolute inset-4 rounded-full border animate-spin"
            style={{ borderColor: 'rgba(124,58,237,0.2)', animationDuration: '16s', animationDirection: 'reverse' }} />
          {/* floating avatar with gradient ring */}
          <div className="absolute inset-8 rounded-full p-[2px] avatar-float"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
            <div className="relative w-full h-full rounded-full overflow-hidden"
              style={{ background: 'var(--card)' }}>
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" priority />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-black gradient-text">MM</span>
              )}
              {/* glass shine sweep */}
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 40%)' }} />
            </div>
          </div>
          {/* ground shadow under floating avatar */}
          <motion.div animate={{ scaleX: [1, 0.82, 1], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-5 rounded-full blur-xl pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.55)' }} />
          <motion.div animate={{ y: [-8, 8, -8], rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-5 -right-5 tech-card px-3.5 py-2 text-xs font-semibold backdrop-blur-md"
            style={{
              color: 'var(--accent)',
              background: 'color-mix(in srgb, var(--card) 80%, transparent)',
              boxShadow: '0 12px 30px -8px var(--shadow), 0 0 20px rgba(0,212,255,0.12)',
              border: '1px solid rgba(0,212,255,0.25)',
            }}>
            {badge1}
          </motion.div>
          <motion.div animate={{ y: [8, -8, 8], rotate: [1.5, -1.5, 1.5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-5 -left-5 tech-card px-3.5 py-2 text-xs font-semibold backdrop-blur-md"
            style={{
              color: 'var(--accent-2)',
              background: 'color-mix(in srgb, var(--card) 80%, transparent)',
              boxShadow: '0 12px 30px -8px var(--shadow), 0 0 20px rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
            }}>
            {badge2}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator — luxury rotating badge */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 group cursor-pointer"
        aria-label={t('scroll')}
      >
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* soft halo */}
          <div className="absolute inset-0 rounded-full blur-xl animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)' }} />
          {/* rotating circular text */}
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <defs>
              <path id="scrollCircle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
            </defs>
            <text fill="var(--accent)" fontSize="8.5" letterSpacing="2.5" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
              <textPath href="#scrollCircle">
                {t('scroll')} • {t('scroll')} • {t('scroll')} •
              </textPath>
            </text>
          </motion.svg>
          {/* inner ring */}
          <div className="absolute inset-5 rounded-full border transition-transform duration-500 group-hover:scale-105"
            style={{ borderColor: 'rgba(0,212,255,0.3)', background: 'color-mix(in srgb, var(--bg) 65%, transparent)', backdropFilter: 'blur(6px)' }} />
          {/* bouncing arrow */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
            style={{ color: 'var(--accent)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.a>

      {/* ===== Ball easter egg ===== */}
      <AnimatePresence>
        {burst && (
          <motion.div
            className="fixed inset-0 z-[250] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 22 + i * 6,
                  height: 22 + i * 6,
                  left: `${10 + i * 12}%`,
                  background: `radial-gradient(circle at 30% 30%, ${i % 2 ? '#fff' : 'var(--accent)'}, ${i % 2 ? 'var(--accent-2)' : 'var(--accent-2)'})`,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.35), 0 0 30px var(--accent-glow)',
                }}
                initial={{ y: '-10vh', x: 0, rotate: 0 }}
                animate={{
                  y: ['-10vh', '60vh', '25vh', '70vh', '45vh', '80vh'],
                  x: [0, i % 2 ? 40 : -40, i % 2 ? -25 : 25, 0],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: 3.2,
                  delay: i * 0.12,
                  ease: 'easeIn',
                  times: [0, 0.28, 0.5, 0.7, 0.85, 1],
                }}
                onAnimationComplete={() => { if (i === 6) setBurst(false); }}
              />
            ))}
            <motion.div className="absolute inset-0"
              initial={{ opacity: 0.0 }}
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 2.4 }}
              style={{ background: 'radial-gradient(circle at 50% 60%, var(--accent-glow), transparent 60%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
