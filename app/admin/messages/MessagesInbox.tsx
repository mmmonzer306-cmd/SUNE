'use client';
import { useState } from 'react';
import { FiMail, FiMail as FiMailOpen, FiTrash2, FiCheckSquare, FiEdit3, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Message { id: number; name: string; email: string; subject?: string; message: string; read: boolean; createdAt: string; }

export default function MessagesInbox({ initial }: { initial: Message[] }) {
  const [messages, setMessages] = useState(initial);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [replying, setReplying] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');

  const sendReply = () => {
    if (!replying) return;
    const subject = encodeURIComponent(`Re: ${replying.subject || 'Your message'}`);
    const body = encodeURIComponent(`Hi ${replying.name},\n\n${replyText}\n\n— Mohammed`);
    window.open(`mailto:${replying.email}?subject=${subject}&body=${body}`);
    setReplying(null);
    setReplyText('');
  };

  const toggleRead = async (m: Message) => {
    const next = !m.read;
    setMessages((prev) => prev.map((x) => x.id === m.id ? { ...x, read: next } : x));
    await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: m.id, read: next }) });
  };

  const del = async (ids: number[]) => {
    if (!confirm(`Delete ${ids.length} message(s)?`)) return;
    setMessages((prev) => prev.filter((x) => !ids.includes(x.id)));
    setSelected(new Set());
    await fetch('/api/contact', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });
  };

  const toggleAll = () => {
    setSelected(selected.size === messages.length ? new Set() : new Set(messages.map((m) => m.id)));
  };

  if (messages.length === 0) {
    return <div className="tech-card p-12 text-center" style={{ color: 'var(--text-muted)' }}>{'// No messages yet.'}</div>;
  }

  return (
    <div className="space-y-4 relative">
      {/* Reply drawer */}
      <AnimatePresence>
        {replying && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="tech-card p-6 mb-4 relative"
            style={{ borderColor: 'var(--accent)', boxShadow: '0 20px 50px -15px var(--shadow), 0 0 30px var(--accent-glow)' }}>
            <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>Reply to {replying.name}</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>{replying.email}</p>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4}
              placeholder="Write your reply..." className="tech-input resize-none text-sm" />
            <div className="flex gap-2 mt-4">
              <button onClick={sendReply} className="btn-primary text-sm flex items-center gap-2">
                <FiSend size={13} /> Open in Email App
              </button>
              <button onClick={() => { setReplying(null); setReplyText(''); }} className="btn-outline text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected.size > 0 && (
        <div className="tech-card p-3 flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected.size} selected</span>
          <button onClick={() => del(Array.from(selected))} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
            <FiTrash2 size={13} /> Delete selected
          </button>
        </div>
      )}
      <button onClick={toggleAll} className="text-xs flex items-center gap-2 transition-colors" style={{ color: 'var(--text-muted)' }}>
        <FiCheckSquare size={13} /> {selected.size === messages.length ? 'Unselect all' : 'Select all'}
      </button>
      {messages.map((msg) => (
        <div key={msg.id} className="tech-card p-6"
          style={{ borderColor: !msg.read ? 'rgba(0,212,255,0.25)' : 'var(--border)', opacity: msg.read ? 0.8 : 1 }}>
          <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <input type="checkbox" checked={selected.has(msg.id)}
                onChange={(e) => {
                  const next = new Set(selected);
                  if (e.target.checked) next.add(msg.id); else next.delete(msg.id);
                  setSelected(next);
                }}
                style={{ accentColor: 'var(--accent)', marginTop: 6 }} />
              <div>
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold" style={{ color: 'var(--text)' }}>{msg.name}</span>
                  <a href={`mailto:${msg.email}`} className="text-sm" style={{ color: 'var(--accent)' }}>{msg.email}</a>
                  {!msg.read && <span className="text-xs px-2 py-0.5 rounded tag-accent">New</span>}
                </div>
                {msg.subject && <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{msg.subject}</p>}
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{msg.message}</p>
                <button onClick={() => setReplying(msg)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  style={{ color: 'var(--accent)', background: 'var(--accent-glow)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <FiEdit3 size={11} /> Reply
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
              <div className="flex gap-1">
                <button onClick={() => toggleRead(msg)} title={msg.read ? 'Mark as unread' : 'Mark as read'}
                  className="p-2 rounded transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)' }}>
                  {msg.read ? <FiMail size={15} /> : <FiMailOpen size={15} />}
                </button>
                <button onClick={() => del([msg.id])} title="Delete"
                  className="p-2 rounded transition-colors hover:text-red-400"
                  style={{ color: 'var(--text-muted)' }}>
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
