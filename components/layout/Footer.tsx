'use client';
import Link from 'next/link';
import { FiGithub, FiSend } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

interface Profile { github?: string; facebook?: string; telegram?: string; }

export default function Footer({ profile }: { profile: Profile }) {
  const { t } = useApp();
  return (
    <footer className="border-t py-10" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-display text-xl font-bold">
              <span style={{ color: 'var(--accent)' }}>MM</span>
              <span className="text-sm ms-1" style={{ color: 'var(--text-muted)' }}>_dev</span>
            </span>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Full-Stack Developer & Software Engineer</p>
          </div>
          <div>
            <p className=" text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>{t('footer.quickLinks')}</p>
            <div className="space-y-2">
              {[['#about', t('nav.about')], ['#skills', t('nav.skills')], ['#contact', t('nav.contact')], ['/blog', t('nav.blog')]].map(([href, label]) => (
                <Link key={href} href={href} className="block text-sm transition-colors" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className=" text-xs uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>{t('footer.connect')}</p>
            <div className="flex gap-3">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <FiGithub size={16} />
                </a>
              )}
              {profile.telegram && (
                <a href={profile.telegram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:scale-110"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                  <FiSend size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t pt-6 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className=" text-xs" style={{ color: 'var(--muted)' }}>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
