'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [show, setShow] = useState({ curr: false, new: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirmPass) {
      setError('New passwords do not match');
      return;
    }
    if (form.newPass.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPass: form.currentPass, newPass: form.newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        await update();
        router.push('/admin');
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  const InputField = ({ field, label, showKey }: { field: keyof typeof form; label: string; showKey: keyof typeof show }) => (
    <div>
      <label className="block text-sm  mb-2" style={{ color: 'var(--text-muted)' }}>{label}</label>
      <div className="relative">
        <FiLock className="absolute start-4 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--muted)' }} />
        <input
          type={show[showKey] ? 'text' : 'password'}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          required
          className="tech-input has-icon-start has-icon-end"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
          className="absolute end-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--muted)' }}>
          {show[showKey] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center grid-bg" style={{ background: 'var(--bg)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="tech-card w-full max-w-md p-10">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <FiShield size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="font-display text-2xl font-bold gradient-text">Set New Password</h1>
          <p className="text-sm  mt-2" style={{ color: 'var(--text-muted)' }}>
             {'// First login - please change your password'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField field="currentPass" label="Current Password" showKey="curr" />
          <InputField field="newPass" label="New Password" showKey="new" />
          <InputField field="confirmPass" label="Confirm New Password" showKey="confirm" />

          {/* Password strength hint */}
          {form.newPass && (
            <div className="text-xs  px-3 py-2 rounded" style={{
              background: form.newPass.length >= 8 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: form.newPass.length >= 8 ? '#10b981' : '#ef4444',
              border: `1px solid ${form.newPass.length >= 8 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              {form.newPass.length >= 8 ? '✓ Password is strong enough' : `✗ ${8 - form.newPass.length} more characters needed`}
            </div>
          )}

          {error && (
            <p className="text-sm  text-center px-3 py-2 rounded"
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading ? 'Saving...' : 'Save New Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
