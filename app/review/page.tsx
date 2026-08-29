'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiSend, FiUser, FiBriefcase, FiMessageSquare } from 'react-icons/fi';

export default function ReviewPage() {
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-20" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-80 blur-3xl opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.10), transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg"
      >
        <div className="rounded-3xl p-[1.5px]"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.35), rgba(124,58,237,0.3), transparent 60%)' }}>
          <div className="rounded-[calc(1.5rem-1px)] p-8 md:p-10 relative overflow-hidden"
            style={{ background: 'color-mix(in srgb, var(--card) 90%, transparent)', backdropFilter: 'blur(16px)' }}>

            {status === 'success' ? (
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center animate-pulse-glow"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                  ✓
                </motion.div>
                <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Thank you!</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your review was submitted and will be published after approval.</p>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse-glow"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
                    <FiMessageSquare size={22} color="#fff" />
                  </div>
                  <h1 className="font-display text-2xl font-bold gradient-text">Share Your Experience</h1>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Your feedback helps others trust the work ✦</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <div className="relative">
                    <FiUser className="absolute start-4 top-1/2 -translate-y-1/2" size={15} style={{ color: 'var(--muted)' }} />
                    <input type="text" placeholder="Your name" value={form.name} required
                      onChange={(e) => setForm({ ...form, name: e.target.value })} className="tech-input ps-12 py-3.5" />
                  </div>
                  <div className="relative">
                    <FiBriefcase className="absolute start-4 top-1/2 -translate-y-1/2" size={15} style={{ color: 'var(--muted)' }} />
                    <input type="text" placeholder="Role / Company (optional)" value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })} className="tech-input ps-12 py-3.5" />
                  </div>
                  <div className="relative">
                    <FiMessageSquare className="absolute start-4 top-4" size={15} style={{ color: 'var(--muted)' }} />
                    <textarea placeholder="Tell others about working with Mohammed..." value={form.content} required rows={4}
                      onChange={(e) => setForm({ ...form, content: e.target.value })} className="tech-input ps-12 py-3.5 resize-none" />
                  </div>

                  <div className="flex items-center justify-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.button key={n} type="button" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setForm({ ...form, rating: n })}>
                        <FiStar size={26}
                          style={{ color: n <= form.rating ? '#f59e0b' : 'var(--muted)', fill: n <= form.rating ? '#f59e0b' : 'none' }} />
                      </motion.button>
                    ))}
                  </div>

                  <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center gap-2">
                    {status === 'loading' ? 'Sending...' : <><FiSend /> Submit Review</>}
                  </button>
                  {status === 'error' && <p className="text-center text-xs" style={{ color: '#f87171' }}>Something went wrong. Try again.</p>}
                </form>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted)' }}>Reviews are moderated by Mohammed</p>
      </motion.div>
    </div>
  );
}
