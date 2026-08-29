'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMail, FiGithub, FiPhone, FiCopy, FiArrowLeft, FiArrowRight, FiCheck, FiUser, FiMessageSquare, FiDollarSign } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useApp } from '@/lib/AppContext';
import { toast } from '@/components/ui/Toast';
import SectionHeader from './SectionHeader';

interface Profile { email?: string; phone?: string; github?: string; facebook?: string; telegram?: string; whatsapp?: string; }

const DRAFT_KEY = 'contact-draft';
const ease = [0.22, 1, 0.36, 1] as const;

type Snippets = Record<string, { value: string; valueAr: string | null }>;

export default function Contact({ profile, snippets = {} }: { profile: Profile; snippets?: Snippets }) {
  const { t, lang } = useApp();
  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', subject: '', budget: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setForm(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    if (status === 'idle' && (form.name || form.email || form.message || form.subject)) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }
  }, [form, status]);

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: `${form.message}${form.budget ? `\n\n${lang === 'ar' ? 'الميزانية' : 'Budget'}: ${form.budget}` : ''}`,
          website: '',
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) {
        setForm({ name: '', email: '', subject: '', budget: '', message: '' });
        localStorage.removeItem(DRAFT_KEY);
        toast(t('form.success'));
      }
    } catch { setStatus('error'); }
  };

  const projectOptions = [
    t('option.service'),
    t('option.restaurant'),
    t('option.ecommerce'),
    t('option.portfolio'),
  ];

  const budgetOptions = lang === 'ar'
    ? ['أقل من $500', '$500 – $1000', '$1000 – $3000', '+$3000']
    : ['Under $500', '$500 – $1000', '$1000 – $3000', '$3000+'];

  const waHref = profile.whatsapp || (profile.phone ? `https://wa.me/${profile.phone.replace(/\D/g, '')}` : null);
  const contacts = [
    { icon: FiMail, val: profile.email, href: profile.email ? `mailto:${profile.email}` : null, copy: !!profile.email },
    { icon: FiPhone, val: profile.phone, href: profile.phone ? `tel:${profile.phone}` : null, copy: false },
    { icon: FaWhatsapp, val: 'WhatsApp', href: waHref, copy: false },
    { icon: FiGithub, val: 'GitHub', href: profile.github, copy: false },
  ].filter((c) => c.val && c.href);

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => toast(t('contact.emailCopied')));
  };

  const stepValid = () => {
    if (step === 0) return form.name.trim().length > 1 && /.+@.+\..+/.test(form.email);
    if (step === 1) return form.subject !== '';
    return form.message.trim().length > 5;
  };

  const steps = lang === 'ar'
    ? ['معلوماتك', 'نوع المشروع', 'التفاصيل']
    : ['Your Info', 'Project Type', 'Details'];

  return (
    <section id="contact" className="py-32 relative" style={{ background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.contact', 'contact.init()')} title={t('contact.title')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <p className="leading-relaxed mb-8 font-medium text-[15px]" style={{ color: 'var(--text-muted)' }}>{snip('contact.intro', t('contact.getInTouch'))}</p>
            <div className="space-y-4">
              {contacts.map(({ icon: Icon, val, href, copy }, i) => (
                <motion.a
                  key={String(val)}
                  href={href || '#'}
                  target={href?.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease }}
                  whileHover={{ y: -5 }}
                  className="tech-card skill-card-float flex items-center gap-4 px-5 py-4 relative"
                  style={{ animationDelay: `${i * 0.35}s` }}
                >
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'var(--accent-glow)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(212,175,106,0.22)',
                      boxShadow: '0 8px 20px -8px var(--accent-glow)',
                    }}>
                    <Icon size={17} />
                  </span>
                  <span className="text-sm font-semibold flex-1 min-w-0 truncate" style={{ color: 'var(--text)' }}>{val}</span>
                  {copy && (
                    <button type="button" onClick={(e) => { e.preventDefault(); copyEmail(String(val)); }} title={t('contact.clickToCopy')}
                      className="p-2 rounded-full transition-all hover:scale-110 active:scale-95 shrink-0"
                      style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      <FiCopy size={14} />
                    </button>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease }}
            className="tech-card p-0 relative overflow-hidden"
            style={{ boxShadow: '0 32px 64px -20px var(--shadow), 0 0 40px var(--accent-glow)' }}
          >
            <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)' }} />
            <div className="p-8">
            {status === 'success' ? (
              <div className="text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'var(--accent-glow)', color: 'var(--accent)', boxShadow: '0 14px 30px var(--accent-glow)' }}>
                  <FiCheck size={28} />
                </motion.div>
                <p className="font-bold text-xl mb-6" style={{ color: 'var(--text)' }}>{t('form.success')}</p>
                <div className="space-y-3 text-sm max-w-xs mx-auto text-start" style={{ color: 'var(--text-muted)' }}>
                  {(lang === 'ar'
                    ? ['✓ تم استلام رسالتك', '→ سأرد خلال ساعتين', '→ مكالمة مجانية لمناقشة التفاصيل']
                    : ['✓ Message received', '→ I reply within 2 hours', '→ Free call to discuss details']
                  ).map((s) => (
                    <p key={s} className="flex items-center gap-2 font-medium">{s}</p>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-0 mb-9">
                  {steps.map((label, i) => (
                    <div key={label} className="flex items-center">
                      <button type="button" onClick={() => i < step && setStep(i)} className="flex flex-col items-center gap-1.5">
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400"
                          style={{
                            background: i <= step ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg)',
                            color: i <= step ? 'var(--bg)' : 'var(--text-muted)',
                            border: `1px solid ${i <= step ? 'transparent' : 'var(--border)'}`,
                            boxShadow: i === step ? '0 8px 20px var(--accent-glow)' : 'none',
                          }}>
                          {i < step ? '✓' : i + 1}
                        </span>
                        <span className="text-[10px] tracking-wide font-medium" style={{ color: i === step ? 'var(--accent)' : 'var(--text-muted)' }}>{label}</span>
                      </button>
                      {i < steps.length - 1 && (
                        <span className="w-12 h-[2px] mx-1.5 mb-4 rounded-full transition-all duration-500"
                          style={{ background: i < step ? 'var(--accent)' : 'var(--border)' }} />
                      )}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={step}
                    initial={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
                    transition={{ duration: 0.45, ease }}>

                    {step === 0 && (
                      <div className="space-y-4">
                        <div className="relative">
                          <FiUser className="absolute top-1/2 -translate-y-1/2 start-4" style={{ color: 'var(--accent)' }} />
                          <input type="text" placeholder={t('contact.name')} value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ paddingInlineStart: "44px" }} className="tech-input" />
                        </div>
                        {form.name && form.name.trim().length < 2 && (
                          <p className="text-xs font-medium" style={{ color: '#f87171' }}>{lang === 'ar' ? '✗ الاسم قصير جدًا' : '✗ Name is too short'}</p>
                        )}
                        <div className="relative">
                          <FiMail className="absolute top-1/2 -translate-y-1/2 start-4" style={{ color: 'var(--accent)' }} />
                          <input type="email" placeholder={t('contact.email')} value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ paddingInlineStart: "44px" }} className="tech-input" />
                        </div>
                        {form.email && !/.+@.+\..+/.test(form.email) && (
                          <p className="text-xs font-medium" style={{ color: '#f87171' }}>{lang === 'ar' ? '✗ البريد غير صحيح' : '✗ Invalid email'}</p>
                        )}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                          {projectOptions.map((opt) => (
                            <button key={opt} type="button" onClick={() => setForm({ ...form, subject: opt })}
                              className={`trait-chip !rounded-xl !py-3.5 !px-3 text-center justify-center ${form.subject === opt ? 'is-on' : ''}`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold mb-2.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                            <FiDollarSign size={12} style={{ color: 'var(--accent)' }} />
                            {snip('contact.budget', lang === 'ar' ? 'الميزانية (اختياري)' : 'Budget (optional)')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {budgetOptions.map((b) => (
                              <button key={b} type="button" onClick={() => setForm({ ...form, budget: form.budget === b ? '' : b })}
                                className={`trait-chip !py-1.5 !px-3.5 ${form.budget === b ? 'is-on' : ''}`}>
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="relative">
                        <FiMessageSquare className="absolute top-4 start-4" style={{ color: 'var(--accent)' }} />
                        <textarea placeholder={t('contact.message')} value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={6} style={{ paddingInlineStart: '44px' }} className="tech-input resize-none" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-3 mt-8">
                  {step > 0 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="btn-outline gap-2 py-2.5 px-5 text-sm">
                      <FiArrowLeft /> {snip('contact.back', lang === 'ar' ? 'رجوع' : 'Back')}
                    </button>
                  )}
                  {step < 2 ? (
                    <button type="button" onClick={() => stepValid() && setStep(step + 1)} disabled={!stepValid()}
                      className="btn-primary gap-2 flex-1 justify-center py-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm">
                      {snip('contact.next', lang === 'ar' ? 'التالي' : 'Next')} <FiArrowRight />
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} disabled={!stepValid() || status === 'loading'}
                      className="btn-primary gap-2 flex-1 justify-center py-2.5 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                      {status === 'loading' ? '...' : <><FiSend /> {t('contact.submit')}</>}
                    </button>
                  )}
                </div>
                {status === 'error' && <p className="text-center text-sm mt-4 font-medium" style={{ color: '#f87171' }}>✗ {t('form.error')}</p>}
              </>
            )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
