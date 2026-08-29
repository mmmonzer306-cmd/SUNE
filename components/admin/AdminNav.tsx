'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useApp } from '@/lib/AppContext';
import {
  FiHome, FiFileText, FiFolder, FiMail, FiCode, FiUser, FiLogOut, FiSettings,
  FiSun, FiMoon, FiLayers, FiMessageSquare, FiClock, FiHelpCircle, FiBarChart2,
  FiChevronLeft, FiChevronRight, FiMenu, FiX, FiGrid,
} from 'react-icons/fi';

const links = [
  { href: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
  { href: '/admin/profile', label: 'Profile', icon: FiUser },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/skills', label: 'Skills', icon: FiCode },
  { href: '/admin/services', label: 'Services', icon: FiLayers },
  { href: '/admin/experience', label: 'Experience', icon: FiClock },
  { href: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { href: '/admin/faqs', label: 'FAQs', icon: FiHelpCircle },
  { href: '/admin/stats', label: 'Stats', icon: FiBarChart2 },
  { href: '/admin/blocks', label: 'Blocks', icon: FiGrid },
  { href: '/admin/texts', label: 'UI Texts', icon: FiFileText },
  { href: '/admin/articles', label: 'Articles', icon: FiFileText },
  { href: '/admin/messages', label: 'Messages', icon: FiMail },
  { href: '/admin/settings', label: 'Settings', icon: FiSettings },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const { theme, toggleTheme } = useApp();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    const saved = localStorage.getItem('admin-collapsed') === '1';
    setCollapsed(saved);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login');
  }, [status, router]);

  useEffect(() => {
    document.documentElement.style.setProperty('--admin-sb', collapsed ? '72px' : '248px');
    localStorage.setItem('admin-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  // Instant navigation indicator — clicks feel immediate
  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  const goFast = (href: string) => {
    if (pathname === href) return;
    setNavigating(true);
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SB = (
    <aside
      className="admin-sidebar fixed top-0 bottom-0 start-0 z-40 hidden lg:flex flex-col transition-all duration-300"
      style={{
        width: collapsed ? 72 : 248,
        background: 'var(--surface)',
        borderInlineEnd: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/admin" className="font-display text-lg font-bold whitespace-nowrap overflow-hidden">
          <span style={{ color: 'var(--accent)' }}>MM</span>
          {!collapsed && <span className="text-xs ms-1.5" style={{ color: 'var(--muted)' }}>Admin Panel</span>}
        </Link>
      </div>

      {/* Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link key={href} href={href} onClick={() => goFast(href)} title={collapsed ? label : undefined}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all group"
              style={{
                background: active ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                border: active ? '1px solid color-mix(in srgb, var(--accent) 25%, transparent)' : '1px solid transparent',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}>
              <Icon size={collapsed ? 19 : 16} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
              {active && !collapsed && (
                <span className="absolute end-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              )}
              {collapsed && (
                <span className="absolute start-full ms-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl"
                  style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={toggleTheme}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
          style={{ color: 'var(--text-muted)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
        </button>
        <Link href="/" target="_blank"
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
          style={{ color: 'var(--text-muted)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <FiHome size={16} /> {!collapsed && <span>View Site</span>}
        </Link>
        <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors"
          style={{ color: '#f87171', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <FiLogOut size={16} /> {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -end-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border transition-all hover:scale-110"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
        {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
      </button>
    </aside>
  );

  // Mobile top bar + drawer
  const MOBILE = (
    <>
      <div       className="admin-mobilebar lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/admin" className="font-display font-bold">
          <span style={{ color: 'var(--accent)' }}>MM</span>
          <span className="text-xs ms-1" style={{ color: 'var(--muted)' }}>admin</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" style={{ color: 'var(--accent)' }}>
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14" style={{ background: 'var(--bg)' }}>
          <nav className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-full pb-24">
            {links.map(({ href, label, icon: Icon, exact }) => (
              <Link key={href} href={href} onClick={() => { goFast(href); setMobileOpen(false); }}
                className="flex items-center gap-3 p-4 rounded-xl text-sm"
                style={{
                  background: isActive(href, exact) ? 'var(--accent-glow)' : 'var(--card)',
                  color: isActive(href, exact) ? 'var(--accent)' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}>
                <Icon size={17} /> {label}
              </Link>
            ))}
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex items-center gap-3 p-4 rounded-xl text-sm"
              style={{ background: 'var(--card)', color: '#f87171', border: '1px solid var(--border)' }}>
              <FiLogOut size={17} /> Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );

  return <>
    {navigating && <div className="nav-loading" />}
    {SB}{MOBILE}
  </>;
}
