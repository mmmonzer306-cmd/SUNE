'use client';
import { useEffect, useState } from 'react';
import MessagesInbox from './MessagesInbox';

interface Message {
  id: number; name: string; email: string; subject?: string | null;
  message: string; read: boolean; createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    fetch('/api/contact').then(async (r) => {
      if (r.status === 401) { window.location.href = '/admin/login'; return; }
      setMessages(await r.json());
    }).catch(() => setMessages([]));
  }, []);

  const unread = messages?.filter((m) => !m.read).length || 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>&gt; messages.inbox</p>
            <h1 className="font-display text-2xl font-bold gradient-text">Messages</h1>
          </div>
          {unread > 0 && (
            <span className="text-xs px-3 py-1.5 rounded-full tag-accent">{unread} unread</span>
          )}
        </div>
        {messages ? (
          <MessagesInbox initial={messages.map((m) => ({ ...m, subject: m.subject ?? undefined }))} />
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading inbox…</p>
        )}
      </main>
    </div>
  );
}
