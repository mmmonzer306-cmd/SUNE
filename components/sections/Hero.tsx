'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiFacebook, FiSend, FiDownload, FiArrowRight, FiPhone } from 'react-icons/fi';
import Image from 'next/image';
import { useApp } from '@/lib/AppContext';

interface Profile {
  name: string; title: string; titleAr?: string; titleFr?: string;
  github?: string; facebook?: string; telegram?: string;
  linkedin?: string; twitter?: string;
  avatarUrl?: string; resumeUrl?: string;
}

const typingTexts: Record<string, string[]> = {
  en: ['Full-stack Web Developer', 'React Specialist', 'Next.js Developer', 'UI/UX Enthusiast'],
  ar: ['مطور ويب متكامل', 'متخصص رياكت', 'مطور Next.js', 'مهتم بتجربة المستخدم'],
  fr: ['Développeur Web Full-Stack', 'Spécialiste React', 'Développeur Next.js', 'Passionné UI/UX'],
};

export default function Hero({ profile }: { profile: Profile }) {
  const { t, lang } = useApp();
  const [displayed, setDisplayed] = useState('');
  const [titleIdx, setTitleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const titles = typingTexts[lang] || typingTexts.en;

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
  ].filter((s) => s.href);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-float"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 70%)', animationDelay: '3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className={`flex-1 text-center ${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-mono text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>
            &gt; {t('hero.greeting')}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="font-display text-5xl lg:text-7xl font-black mb-4 tracking-tight" style={{ color: 'var(--text)' }}>
            {profile.name}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-xl lg:text-2xl font-mono mb-6 h-10 flex items-center gap-1"
            style={{ justifyContent: 'center' }}
          >
            <span className="gradient-text font-bold">{displayed}</span>
            <span style={{ color: 'var(--accent)' }} className="animate-pulse">|</span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 text-lg"
            style={{ color: 'var(--text-muted)' }}>
            {t('hero.description')}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
            <a href="#contact" className="btn-primary gap-2">
              {t('hero.button1')} <FiArrowRight />
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download className="btn-outline gap-2">
                <FiDownload /> {t('downloadCV')}
              </a>
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
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative w-72 h-72 lg:w-96 lg:h-96 shrink-0">
          <div className="absolute inset-0 rounded-full border animate-spin"
            style={{ borderColor: 'rgba(0,212,255,0.15)', animationDuration: '20s' }} />
          <div className="absolute inset-4 rounded-full border animate-spin"
            style={{ borderColor: 'rgba(124,58,237,0.15)', animationDuration: '15s', animationDirection: 'reverse' }} />
          <div className="absolute inset-8 rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(0,212,255,0.15))', border: '1px solid var(--border)' }}>
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt={profile.name} fill className="object-cover" />
            ) : (
              <span className="font-display text-6xl font-black gradient-text">MM</span>
            )}
          </div>
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 tech-card px-3 py-2 text-xs font-mono"
            style={{ color: 'var(--accent)' }}>
            &lt;Code /&gt;
          </motion.div>
          <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-4 -left-4 tech-card px-3 py-2 text-xs font-mono"
            style={{ color: 'var(--accent-2)' }}>
            Full-Stack ✓
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8" style={{ background: `linear-gradient(to bottom, var(--accent), transparent)` }} />
      </motion.div>
    </section>
  );
}
