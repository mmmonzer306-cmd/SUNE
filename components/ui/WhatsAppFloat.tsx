'use client';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useApp } from '@/lib/AppContext';

export default function WhatsAppFloat({ href }: { href?: string | null }) {
  const { lang } = useApp();
  if (!href) return null;
  const url = href.includes('wa.me') ? href : `https://wa.me/${href.replace(/\D/g, '')}`;
  const withMsg = `${url}?text=${encodeURIComponent(lang === 'ar' ? 'مرحبًا أليكس، أريد مناقشة مشروع معك' : 'Hi Alex, I want to discuss a project with you')}`;

  return (
    <motion.a
      href={withMsg} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.12, rotate: 6 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-24 end-6 z-40 w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(34,197,94,0.35)',
      }}
      aria-label="WhatsApp"
    >
      <FaWhatsapp size={22} />
      <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-25" style={{ background: '#22c55e' }} />
    </motion.a>
  );
}
