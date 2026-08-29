'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiFileText, FiFolder, FiMail, FiCode, FiUser, FiSettings, FiLayers, FiMessageSquare, FiClock, FiHelpCircle, FiBarChart2, FiGrid } from 'react-icons/fi';

type Overview = {
  name: string;
  articles: number; projects: number; messages: number; unread: number;
  skills: number; services: number; experience: number; testimonials: number;
  faqs: number; stats: number; blocks: number;
};

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch('/api/admin/overview').then(async (r) => {
      if (r.status === 401) { window.location.href = '/admin/login'; return; }
      setData(await r.json());
    }).catch(() => {});
  }, []);

  const cards = [
    { icon: FiUser, label: 'Profile', sub: 'Edit your info', href: '/admin/profile', color: '#00d4ff' },
    { icon: FiFolder, label: 'Projects', value: data?.projects, href: '/admin/projects', color: '#7c3aed' },
    { icon: FiCode, label: 'Skills', value: data?.skills, href: '/admin/skills', color: '#10b981' },
    { icon: FiLayers, label: 'Services', value: data?.services, href: '/admin/services', color: '#06b6d4' },
    { icon: FiClock, label: 'Experience', value: data?.experience, href: '/admin/experience', color: '#a78bfa' },
    { icon: FiMessageSquare, label: 'Testimonials', value: data?.testimonials, href: '/admin/testimonials', color: '#fb7185' },
    { icon: FiHelpCircle, label: 'FAQs', value: data?.faqs, href: '/admin/faqs', color: '#fbbf24' },
    { icon: FiBarChart2, label: 'Stats', value: data?.stats, href: '/admin/stats', color: '#34d399' },
    { icon: FiGrid, label: 'Blocks', value: data?.blocks, href: '/admin/blocks', color: '#fb923c' },
    { icon: FiFileText, label: 'UI Texts', sub: 'Kick, badges, terminal', href: '/admin/texts', color: '#a78bfa' },
    { icon: FiFileText, label: 'Articles', value: data?.articles, href: '/admin/articles', color: '#f59e0b' },
    { icon: FiMail, label: 'Messages', value: data?.messages, sub: data?.unread ? `${data.unread} unread` : undefined, href: '/admin/messages', color: '#ec4899' },
    { icon: FiSettings, label: 'Settings', sub: 'Theme & Password', href: '/admin/settings', color: '#8888aa' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>&gt; dashboard</p>
          <h1 className="font-display text-3xl font-bold gradient-text">Welcome back, {data?.name || 'Admin'} 👋</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="tech-card glow-hover p-6 block">
              <card.icon className="text-2xl mb-4" style={{ color: card.color }} />
              {card.value !== undefined && (
                <div className="text-3xl font-bold font-display gradient-text mb-1">{card.value ?? '—'}</div>
              )}
              <div className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{card.label}</div>
              {card.sub && <div className="text-xs" style={{ color: card.sub.includes('unread') ? '#f59e0b' : 'var(--text-muted)' }}>{card.sub}</div>}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
