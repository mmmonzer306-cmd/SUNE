'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiHome, FiFileText, FiFolder, FiMail, FiCode, FiUser, FiLogOut, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

const links = [
  { href: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
  { href: '/admin/profile', label: 'Profile', icon: FiUser },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/skills', label: 'Skills', icon: FiCode },
  { href: '/admin/articles', label: 'Articles', icon: FiFileText },
  { href: '/admin/messages', label: 'Messages', icon: FiMail },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useApp();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="border-b px-6 py-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg font-bold">
            <span style={{ color: 'var(--accent)' }}>MM</span>
            <span className="text-xs ms-1" style={{ color: 'var(--muted)' }}>admin</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon, exact }) => (
              <Link key={href} href={href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs  transition-all"
                style={{
                  background: isActive(href, exact) ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
                  color: isActive(href, exact) ? 'var(--accent)' : 'var(--text-muted)',
                  border: isActive(href, exact) ? '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' : '1px solid transparent',
                }}>
                <Icon size={13} /> {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            {theme === 'dark' ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
          <Link href="/" target="_blank" className="text-xs  transition-colors px-2"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            View Site →
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-1.5 text-xs  transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
