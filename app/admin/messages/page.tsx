import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminNav from '@/components/admin/AdminNav';
import { FiMail } from 'react-icons/fi';

export default async function AdminMessages() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  let messages: any[] = [];
  try {
    messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {}

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className=" text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; messages.inbox</p>
          <h1 className="font-display text-2xl font-bold gradient-text">Messages</h1>
        </div>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="tech-card p-12 text-center " style={{ color: 'var(--text-muted)' }}>// No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="tech-card p-6" style={{ borderColor: !msg.read ? 'rgba(0,212,255,0.2)' : 'var(--border)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {msg.read ? <FiMail style={{ color: 'var(--muted)' }} /> : <FiMail style={{ color: 'var(--accent)' }} />}
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold" style={{ color: 'var(--text)' }}>{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-sm " style={{ color: 'var(--accent)' }}>{msg.email}</a>
                        {!msg.read && <span className="text-xs  px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.2)' }}>New</span>}
                      </div>
                      {msg.subject && <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{msg.subject}</p>}
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{msg.message}</p>
                    </div>
                  </div>
                  <span className="text-xs  shrink-0" style={{ color: 'var(--muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
