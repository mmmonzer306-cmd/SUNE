import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import { FiFileText, FiFolder, FiMail, FiCode, FiUser, FiSettings } from 'react-icons/fi';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const [articleCount, projectCount, msgCount, unread, skillCount] = await Promise.all([
    prisma.article.count(),
    prisma.project.count(),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.skill.count(),
  ]);

  const cards = [
    { icon: FiUser, label: 'Profile', sub: 'Edit your info', href: '/admin/profile', color: '#00d4ff' },
    { icon: FiFolder, label: 'Projects', value: projectCount, href: '/admin/projects', color: '#7c3aed' },
    { icon: FiCode, label: 'Skills', value: skillCount, href: '/admin/skills', color: '#10b981' },
    { icon: FiFileText, label: 'Articles', value: articleCount, href: '/admin/articles', color: '#f59e0b' },
    { icon: FiMail, label: 'Messages', value: msgCount, sub: unread ? `${unread} unread` : undefined, href: '/admin/messages', color: '#ec4899' },
    { icon: FiSettings, label: 'Settings', sub: 'Theme & Password', href: '/admin/settings', color: '#8888aa' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className=" text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>&gt; dashboard</p>
          <h1 className="font-display text-3xl font-bold gradient-text">Welcome back, {session.user?.name} 👋</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <a key={card.label} href={card.href} className="tech-card glow-hover p-6 block">
              <card.icon className="text-2xl mb-4" style={{ color: card.color }} />
              {card.value !== undefined && (
                <div className="text-3xl font-bold font-display gradient-text mb-1">{card.value}</div>
              )}
              <div className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{card.label}</div>
              {card.sub && <div className="text-xs " style={{ color: card.sub.includes('unread') ? '#f59e0b' : 'var(--text-muted)' }}>{card.sub}</div>}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
