'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastData = { id: number; message: string };

let pushFn: ((message: string) => void) | null = null;

/** Call from anywhere: toast('Message') */
export function toast(message: string) {
  pushFn?.(message);
}

export default function ToastHost() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const push = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  useEffect(() => {
    pushFn = push;
    return () => { pushFn = null; };
  }, [push]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 py-3 rounded-xl text-sm font-medium shadow-2xl flex items-center gap-2"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              boxShadow: '0 12px 32px var(--shadow), 0 0 20px var(--accent-glow)',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>✓</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
