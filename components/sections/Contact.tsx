'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiGithub, FiPhone } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

interface Profile { email?: string; phone?: string; github?: string; facebook?: string; telegram?: string; }

export default function Contact({ profile }: { profile: Profile }) {
  const { t, lang } = useApp();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setForm({ name: '', email: '', subject: '', message: '' });
    } catch { setStatus('error'); }

    
  };

  const projectOptions = [t('option.service'), t('option.restaurant'), t('option.ecommerce'), t('option.portfolio')];

  const contacts = [
    { icon: FiMail, val: profile.email, href: profile.email ? `mailto:${profile.email}` : null },
    { icon: FiPhone, val: profile.phone, href: profile.phone ? `tel:${profile.phone}` : null },
    { icon: FiGithub, val: 'GitHub', href: profile.github },
  ].filter((c) => c.val);

  return (
    <section id="contact" className="py-32 relative" style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <p className=" text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>&gt; contact.init()</p>
          <h2 className="section-title gradient-text">{t('contact.title')}</h2>
          <div className="w-24 h-px mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>{t('contact.getInTouch')}</p>
            <div className="space-y-4">
              {contacts.map(({ icon: Icon, val, href }) => (
                <a key={String(val)} href={href || '#'} target={href?.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                  className="flex items-center gap-4 transition-colors" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  <span className="w-10 h-10 rounded-lg border flex items-center justify-center"
                    style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                    <Icon size={16} />
                  </span>
                  <span className="text-sm">{val}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder={t('contact.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="tech-input" />
              <input type="email" placeholder={t('contact.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="tech-input" />
            </div>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="tech-input">
              <option value="">{t('contact.selectProject')}</option>
              {projectOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <textarea placeholder={t('contact.message')} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="tech-input resize-none" />
            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center gap-2">
              {status === 'loading' ? '...' : <><FiSend /> {t('contact.submit')}</>}
            </button>
            {status === 'success' && <p className="text-center text-sm " style={{ color: '#4ade80' }}>✓ {t('form.success')}</p>}
            {status === 'error' && <p className="text-center text-sm  text-red-400">✗ {t('form.error')}</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
