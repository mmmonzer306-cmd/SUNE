'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', { ...creds, redirect: false });
    if (res?.ok) {
      // Check if must change password
      const check = await fetch('/api/auth/check-must-change');
      const data = await check.json();
      if (data.mustChange) {
        router.push('/admin/change-password');
      } else {
        router.push('/admin');
      }
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg" style={{ background: 'var(--bg)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="tech-card w-full max-w-sm p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <FiLock size={24} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">Admin Panel</h1>
          <p className="text-xs  mt-1" style={{ color: 'var(--text-muted)' }}>// Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--muted)' }} />
            <input type="text" placeholder="Username" value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              required className="tech-input pl-10" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--muted)' }} />
            <input type={showPass ? 'text' : 'password'} placeholder="Password" value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              required className="tech-input pl-10 pr-10" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
              {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            </button>
          </div>

          {error && (
            <p className="text-sm  text-center py-2 px-3 rounded"
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
