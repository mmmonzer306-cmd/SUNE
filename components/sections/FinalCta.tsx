'use client';
import { motion } from 'framer-motion';
import { FiPhoneCall, FiSend } from 'react-icons/fi';
import { useApp } from '@/lib/AppContext';

export default function FinalCta() {
  const { t } = useApp();

  return (
    <section className="py-28 relative overflow-hidden">
      {/* gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(124,58,237,0.14), transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(0,212,255,0.08), transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl mx-auto px-6 text-center"
      >
        <h2 className="section-title mb-5">{t('cta.title')}</h2>
        <div className="section-ornament mb-6" />
        <p className="text-lg mb-10" style={{ color: 'var(--text-muted)' }}>{t('cta.subtitle')}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#contact" className="btn-primary gap-2 h-12">
            <FiPhoneCall /> {t('cta.call')}
          </a>
          <a href="#contact" className="btn-outline gap-2 h-12">
            <FiSend /> {t('cta.message')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
