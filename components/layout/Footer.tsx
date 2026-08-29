'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGithub, FiSend, FiMail, FiPhone, FiCode, FiLayers, FiFolder, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useApp } from '@/lib/AppContext';

interface Profile {
  github?: string; facebook?: string; telegram?: string; whatsapp?: string;
  email?: string; phone?: string; linkedin?: string;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function Footer({ profile, snippets = {} }: { profile: Profile; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const snip = (key: string, fallback: string) => {
    const value = snippets[key];
    return value ? (lang === 'ar' && value.valueAr ? value.valueAr : value.value) : fallback;
  };

  const quickLinks = [
    { href: '#about', label: t('nav.about'), icon: FiUser },
    { href: '#skills', label: t('nav.skills'), icon: FiCode },
    { href: '#services', label: t('services.title'), icon: FiLayers },
    { href: '#projects', label: t('nav.works'), icon: FiFolder },
    { href: '/blog', label: t('nav.blog'), icon: FiSend },
    { href: '#contact', label: t('nav.contact'), icon: FiMail },
  ];

  const socials = [
    { icon: FiGithub, href: profile.github, label: 'GitHub', color: '#e2e8f0' },
    { icon: FiSend, href: profile.telegram, label: 'Telegram', color: '#38bdf8' },
    { icon: FaWhatsapp, href: profile.whatsapp, label: 'WhatsApp', color: '#22c55e' },
    { icon: FiMail, href: profile.email ? `mailto:${profile.email}` : null, label: 'Email', color: '#f59e0b' },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* animated gradient top border */}
      <div className="h-[2px] w-full"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), var(--accent), transparent)', backgroundSize: '200% 100%', animation: 'footerBeam 4s linear infinite' }} />

      {/* ambient glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-64 blur-3xl pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.08), transparent 70%)' }} />
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(124,58,237,0.05), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block group">
              <span className="font-display text-2xl font-black">
                <span className="gradient-text">{snip('brand.mark', 'MM')}</span>
                <span className="text-sm ms-1" style={{ color: 'var(--text-muted)' }}>{snip('brand.suffix', '_dev')}</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              {snip('footer.description', lang === 'ar'
                ? 'مطور متكامل ومهندس برمجيات - أحوّل الأفكار إلى منتجات رقمية حية.'
                : 'Full-Stack Developer & Software Engineer - turning ideas into living digital products.')}
            </p>
            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="mt-4 inline-flex items-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--accent)' }}>
                <FiPhone size={14} /> {profile.phone}
              </a>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'var(--text-muted)' }}>
              {t('footer.quickLinks')}
            </p>
            <div className="grid grid-cols-2 gap-1">
              {quickLinks.map(({ href, label, icon: Icon }, i) => (
                <motion.div key={href}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={href}
                    className="group flex items-center gap-2 py-1.5 text-sm transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                    <Icon size={12} className="transition-transform group-hover:translate-x-0.5" />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'var(--text-muted)' }}>
              {t('footer.connect')}
            </p>
            <div className="flex gap-3 flex-wrap">
              {socials.map(({ icon: Icon, href, label, color }, i) => (
                <motion.a key={label} href={href!} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -5, rotate: -4 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center border transition-shadow"
                  style={{ borderColor: 'var(--border)', color, background: 'var(--bg)' }}
                  title={label}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
            <a href="#contact"
              className="mt-5 inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-semibold transition-transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: '#fff',
                boxShadow: '0 8px 24px var(--accent-glow)',
              }}>
              {snip('footer.cta', t('hero.button1'))}
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{t('footer.copyright')}</p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
            {snip('footer.crafted', lang === 'ar' ? 'صُنع بـ' : 'Crafted with')}
            <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <FiCode size={13} style={{ color: 'var(--accent)' }} />
            </motion.span>
            {snip('footer.passion', lang === 'ar' ? 'وكثير من الشغف' : '& a lot of passion')}
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes footerBeam {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </footer>
  );
}
