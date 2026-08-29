'use client';
import { useEffect, useState, type ComponentType, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useApp } from '@/lib/AppContext';
import { toast } from '@/components/ui/Toast';
import * as Fi from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface Service {
  id: number; title: string; titleAr?: string | null;
  description?: string | null; descAr?: string | null;
  icon?: string | null; price?: string | null;
  delivery?: string | null; deliveryAr?: string | null;
}

function getIcon(name?: string | null) {
  if (!name) return Fi.FiLayers;
  const icons = Fi as unknown as Record<string, ComponentType<{ size?: number | string; style?: CSSProperties }>>;
  return icons[name] || Fi.FiLayers;
}

type Snippets = Record<string, { value: string; valueAr: string | null }>;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Services({
  services,
  snippets = {},
  whatsapp,
}: {
  services: Service[];
  snippets?: Snippets;
  whatsapp?: string | null;
}) {
  const { t, lang } = useApp();
  const [open, setOpen] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const snip = (k: string, fb: string) => {
    const s = snippets[k];
    return s ? ((lang === 'ar' && s.valueAr) ? s.valueAr : s.value) : fb;
  };

  // Resolved on the server and passed down — no extra client request.
  const wa = whatsapp
    ? (whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, '')}`)
    : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!services.length) return null;

  const titleOf = (s: Service) => (lang === 'ar' && s.titleAr) ? s.titleAr : s.title;
  const descOf = (s: Service) => (lang === 'ar' && s.descAr) ? s.descAr : s.description;
  const delOf = (s: Service) => (lang === 'ar' && s.deliveryAr) ? s.deliveryAr : s.delivery;

  const submit = async () => {
    if (!open) return;
    if (form.name.trim().length < 2 || !/.+@.+\..+/.test(form.email)) {
      toast(lang === 'ar' ? 'أدخل اسماً وبريداً صحيحين' : 'Enter a valid name and email');
      return;
    }
    setStatus('loading');
    const payload = {
      name: form.name,
      email: form.email,
      subject: titleOf(open),
      message: `${form.message || ''}\n\n— ${titleOf(open)}${open.price ? ` · ${open.price}` : ''}${delOf(open) ? ` · ${delOf(open)}` : ''}`,
      website: '',
    };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setStatus('success');
        toast(t('form.success'));
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('idle');
        toast(t('form.error'));
      }
    } catch {
      setStatus('idle');
      toast(t('form.networkError'));
    }
  };

  const waOrder = () => {
    if (!open || !wa) return;
    const text = encodeURIComponent(
      lang === 'ar'
        ? `مرحباً، أريد طلب خدمة: ${titleOf(open)}${open.price ? ` (${open.price})` : ''}`
        : `Hello, I want to order: ${titleOf(open)}${open.price ? ` (${open.price})` : ''}`
    );
    const base = wa.includes('?') ? `${wa}&text=${text}` : `${wa}${wa.includes('wa.me') ? `?text=${text}` : ''}`;
    window.open(base, '_blank', 'noopener,noreferrer');
  };

  const featured = Math.min(1, services.length - 1);

  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader kicker={snip('kicker.services', 'services.offer()')} title={t('services.title')} hint={t('services.subtitle')} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon);
            const hot = i === featured;
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.1, duration: 0.85, ease }}
                whileHover={{ y: -14, rotate: hot ? 0 : i % 2 ? 0.5 : -0.5 }}
                className="tech-card skill-card-float p-7 flex flex-col relative"
                style={{
                  animationDelay: `${i * 0.4}s`,
                  transform: hot ? 'scale(1.03)' : undefined,
                  boxShadow: hot ? '0 28px 60px -18px var(--shadow), 0 0 40px var(--accent-glow)' : undefined,
                }}
              >
                {hot && (
                  <span className="absolute top-4 end-4 text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--bg)' }}>
                    {lang === 'ar' ? 'الأكثر طلباً' : 'Most requested'}
                  </span>
                )}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(212,175,106,0.28)',
                    boxShadow: '0 12px 28px -10px var(--accent-glow)',
                  }}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>{titleOf(s)}</h3>
                {descOf(s) && <p className="text-sm leading-relaxed mb-6 flex-1 font-medium" style={{ color: 'var(--text-muted)' }}>{descOf(s)}</p>}
                <div className="mt-auto space-y-4">
                  <div className="flex items-end justify-between gap-3">
                    {s.price && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--text-muted)' }}>{t('services.from')}</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{s.price}</p>
                      </div>
                    )}
                    {delOf(s) && (
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {delOf(s)}
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => { setOpen(s); setStatus('idle'); }} className="btn-primary w-full justify-center text-sm h-11">
                    {t('services.cta')}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="tech-card w-full max-w-lg p-0 relative overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 40px 90px -20px var(--shadow), 0 0 50px var(--accent-glow)',
                border: '1px solid rgba(212,175,106,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent)' }} />
              <div className="p-8">
              <button type="button" onClick={() => setOpen(null)} className="absolute top-5 end-5 w-9 h-9 rounded-full flex items-center justify-center"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--bg)' }}>
                <Fi.FiX />
              </button>
              {status === 'success' ? (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ background: 'var(--accent-glow)', color: 'var(--accent)', boxShadow: '0 14px 30px var(--accent-glow)' }}>
                    <Fi.FiCheck size={28} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{t('form.success')}</h3>
                  <button type="button" className="btn-outline mt-4" onClick={() => setOpen(null)}>
                    {lang === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.24em] mb-2 font-bold" style={{ color: 'var(--accent)' }}>
                    {lang === 'ar' ? 'طلب خدمة' : 'Service order'}
                  </p>
                  <div className="flex items-center gap-2.5 mb-6 rounded-xl p-3"
                    style={{ background: 'var(--accent-glow)', border: '1px solid rgba(212,175,106,0.25)' }}>
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'var(--bg)' }}>
                      <Fi.FiShoppingBag size={15} />
                    </span>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{titleOf(open)}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {open.price && (
                      <span className="trait-chip !py-1.5 !px-3.5">{open.price}</span>
                    )}
                    {delOf(open) && (
                      <span className="trait-chip !py-1.5 !px-3.5">{delOf(open)}</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <Fi.FiUser className="absolute top-1/2 -translate-y-1/2 start-4" style={{ color: 'var(--accent)' }} />
                      <input style={{ paddingInlineStart: "44px" }} className="tech-input" placeholder={t('contact.name')} value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="relative">
                      <Fi.FiMail className="absolute top-1/2 -translate-y-1/2 start-4" style={{ color: 'var(--accent)' }} />
                      <input style={{ paddingInlineStart: "44px" }} className="tech-input" placeholder={t('contact.email')} value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="relative">
                      <Fi.FiMessageSquare className="absolute top-4 start-4" style={{ color: 'var(--accent)' }} />
                      <textarea style={{ paddingInlineStart: "44px" }} className="tech-input min-h-28" placeholder={t('contact.message')} value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <motion.button whileTap={{ scale: 0.97 }} type="button" className="btn-primary flex-1 justify-center gap-2 h-12" disabled={status === 'loading'} onClick={submit}>
                      <Fi.FiSend /> {status === 'loading' ? '…' : t('contact.submit')}
                    </motion.button>
                    {wa && (
                      <motion.button whileTap={{ scale: 0.97 }} type="button" className="btn-outline flex-1 justify-center gap-2 h-12" onClick={waOrder}
                        style={{ borderColor: '#25D366', color: '#25D366' }}>
                        <FaWhatsapp /> WhatsApp
                      </motion.button>
                    )}
                  </div>
                </>
              )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
